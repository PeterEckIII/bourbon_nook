package com.bourbon_nook.users_api.controllers;

import com.bourbon_nook.users_api.dtos.UserDto;
import com.bourbon_nook.users_api.models.requests.ChangePasswordRequest;
import com.bourbon_nook.users_api.models.requests.CreateUserRequest;
import com.bourbon_nook.users_api.models.requests.DeleteAccountRequest;
import com.bourbon_nook.users_api.models.requests.LoginRequest;
import com.bourbon_nook.users_api.models.responses.CreateUserResponse;
import com.bourbon_nook.users_api.services.AuthService;
import com.bourbon_nook.users_api.services.RefreshTokenService;
import com.bourbon_nook.users_api.services.UserService;
import com.bourbon_nook.users_api.utils.JwtUtil;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;
    private final ModelMapper modelMapper;

    private static final Duration REFRESH_TOKEN_VALIDITY = Duration.ofDays(7);

    public AuthController(AuthenticationManager authenticationManager, UserService userService, AuthService authService, RefreshTokenService refreshTokenService, JwtUtil jwtUtil, ModelMapper modelMapper) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
        this.jwtUtil = jwtUtil;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/me")
    public ResponseEntity<CreateUserResponse> me() {
        UserDto currentUser = authService.getCurrentUser();
        if(currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(modelMapper.map(currentUser, CreateUserResponse.class));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount(@RequestBody DeleteAccountRequest deleteAccountRequest) {
        UserDto currentUser = authService.getCurrentUser();
        if(currentUser == null) {
            throw new BadCredentialsException("Not authenticated");
        }

        if(!authService.verifyPassword(currentUser.getEmail(), deleteAccountRequest.getPassword())) {
            throw new BadCredentialsException("Wrong password");
        }

        refreshTokenService.revokeAllForUser(currentUser.getUserId());
        userService.deleteUser(currentUser.getUserId());

        ResponseCookie expiredAccessTokenCookie = buildExpiredAccessTokenCookie();
        ResponseCookie expiredRefreshTokenCookie = buildExpiredRefreshTokenCookie();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, expiredAccessTokenCookie.toString())
                .header(HttpHeaders.SET_COOKIE, expiredRefreshTokenCookie.toString())
                .build();
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody LoginRequest loginRequest) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        UserDetails principal = (UserDetails) auth.getPrincipal();
        UserDto userDto = userService.getUserDetailsByEmail(principal.getUsername());
        ResponseCookie cookie = buildJwtCookie(principal, userDto.getUserId());

        ResponseCookie refreshTokenCookie = issueRefreshTokenCookie(userDto.getUserId());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .header("userId", userDto.getUserId())
                .build();
    }

    @PostMapping("/register")
    public ResponseEntity<CreateUserResponse> register(@RequestBody CreateUserRequest createUserRequest) {
        UserDto userDto = modelMapper.map(createUserRequest, UserDto.class);
        UserDto createdUser = userService.createUser(userDto, createUserRequest.getPassword());

        UserDetails principal = userService.loadUserByUsername(createdUser.getEmail());
        ResponseCookie cookie = buildJwtCookie(principal, createdUser.getUserId());

        ResponseCookie refreshTokenCookie = issueRefreshTokenCookie(createdUser.getUserId());

        CreateUserResponse createUserResponse = modelMapper.map(createdUser, CreateUserResponse.class);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .header("userId", createdUser.getUserId())
                .body(createUserResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@CookieValue(name = "refreshToken", required = false) String refreshTokenId) {
        if(refreshTokenId != null) {
            refreshTokenService.revoke(refreshTokenId);
        }
        ResponseCookie expiredAccessTokenCookie = buildExpiredAccessTokenCookie();
        ResponseCookie expiredRefreshTokenCookie = buildExpiredRefreshTokenCookie();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, expiredAccessTokenCookie.toString())
                .header(HttpHeaders.SET_COOKIE, expiredRefreshTokenCookie.toString())
                .build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest,
                                               @CookieValue(name = "refreshToken", required = false) String refreshTokenId) {
        UserDto currentUser = authService.getCurrentUser();
        if(currentUser == null) {
            throw new BadCredentialsException("Not authenticated");
        }

        if(!changePasswordRequest.getNewPassword().equals(changePasswordRequest.getConfirmPassword())) {
            throw new BadCredentialsException("Passwords do not match");
        }

        if(!authService.verifyPassword(currentUser.getEmail(), changePasswordRequest.getOldPassword())) {
            throw new BadCredentialsException("Wrong existing password");
        }

        if(refreshTokenId != null) {
            refreshTokenService.revokeAllForUser(currentUser.getUserId());
        }

        authService.updatePassword(currentUser.getEmail(), changePasswordRequest.getNewPassword());

        ResponseCookie expiredAccessTokenCookie = buildExpiredAccessTokenCookie();
        ResponseCookie expiredRefreshTokenCookie = buildExpiredRefreshTokenCookie();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, expiredAccessTokenCookie.toString())
                .header(HttpHeaders.SET_COOKIE, expiredRefreshTokenCookie.toString())
                .build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshTokenId) {
        if(refreshTokenId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Optional<String> userIdOpt = refreshTokenService.validateAndGetUserId(refreshTokenId);

        if(userIdOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String userId = userIdOpt.get();

        refreshTokenService.revoke(refreshTokenId);
        ResponseCookie refreshTokenCookie = issueRefreshTokenCookie(userId);

        UserDto userDto = userService.getUserByUserId(userId);
        UserDetails principal = userService.loadUserByUsername(userDto.getEmail());

        ResponseCookie accessCookie = buildJwtCookie(principal, userId);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .build();
    }

    private ResponseCookie.ResponseCookieBuilder baseCookieBuilder(String value, Duration maxAge) {
        return ResponseCookie.from("jwt", value)
                .httpOnly(true)
                .secure(true)
                // TODO: revisit SameSite once frontend/API domain structure is decided.
                // Strict works only if same-origin or same-site; switch to Lax or None+Secure if cross-origin.
                .sameSite("Strict")
                .path("/")
                .maxAge(maxAge);
    }

    private ResponseCookie buildJwtCookie(UserDetails principal, String userId) {
        String token = jwtUtil.generateToken(principal, userId);
        return baseCookieBuilder(token, Duration.ofHours(1)).build();
    }

    private ResponseCookie buildExpiredAccessTokenCookie() {
        return baseCookieBuilder("", Duration.ZERO).build();
    }

    private ResponseCookie buildRefreshTokenCookie(String tokenId) {
        return ResponseCookie.from("refreshToken", tokenId)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/auth/refresh")
                .maxAge(REFRESH_TOKEN_VALIDITY)
                .build();
    }

    private ResponseCookie buildExpiredRefreshTokenCookie() {
        return ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/auth/refresh")
                .maxAge(0)
                .build();
    }

    private ResponseCookie issueRefreshTokenCookie(String userId) {
        String id = refreshTokenService.issue(userId, REFRESH_TOKEN_VALIDITY);
        return buildRefreshTokenCookie(id);
    }
}
