package com.bourbon_nook.users_api.controllers;

import com.bourbon_nook.users_api.dtos.UserDto;
import com.bourbon_nook.users_api.models.requests.CreateUserRequest;
import com.bourbon_nook.users_api.models.requests.LoginRequest;
import com.bourbon_nook.users_api.models.responses.CreateUserResponse;
import com.bourbon_nook.users_api.services.UserService;
import com.bourbon_nook.users_api.utils.JwtUtil;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final ModelMapper modelMapper;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtUtil jwtUtil, ModelMapper modelMapper) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody LoginRequest loginRequest) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        UserDetails principal = (UserDetails) auth.getPrincipal();
        UserDto userDto = userService.getUserDetailsByEmail(principal.getUsername());
        ResponseCookie cookie = buildJwtCookie(principal, userDto.getUserId());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .header("userId", userDto.getUserId())
                .build();
    }

    @PostMapping("/register")
    public ResponseEntity<CreateUserResponse> register(@RequestBody CreateUserRequest createUserRequest) {
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        UserDto userDto = modelMapper.map(createUserRequest, UserDto.class);
        UserDto createdUser = userService.createUser(userDto);

        UserDetails principal = userService.loadUserByUsername(createdUser.getEmail());
        ResponseCookie cookie = buildJwtCookie(principal, createdUser.getUserId());

        CreateUserResponse createUserResponse = modelMapper.map(createdUser, CreateUserResponse.class);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .header("userId", createdUser.getUserId())
                .body(createUserResponse);
    }

    private ResponseCookie buildJwtCookie(UserDetails principal, String userId) {
        String token = jwtUtil.generateToken(principal, userId);

        return ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(true)
                // TODO: revisit SameSite once frontend/API domain structure is decided.
                // Strict works only if same-origin or same-site; switch to Lax or None+Secure if cross-origin.
                .sameSite("Strict")
                .path("/")
                .maxAge(Duration.ofHours(1))
                .build();
    }
}
