package com.bourbon_nook.users_api.controllers;

import com.bourbon_nook.users_api.dtos.FollowCountsDto;
import com.bourbon_nook.users_api.dtos.UserSummaryDto;
import com.bourbon_nook.users_api.services.AuthService;
import com.bourbon_nook.users_api.services.FollowService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/follows")
public class FollowController {
    private final FollowService followService;
    private final AuthService authService;

    public FollowController(FollowService followService, AuthService authService) {
        this.followService = followService;
        this.authService = authService;
    }

    @PostMapping("/{followeeId}")
    public ResponseEntity<Void> follow(@PathVariable("followeeId") Long followeeId) {
        followService.follow(authService.getCurrentUserId(), followeeId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{followeeId}")
    public ResponseEntity<Void> unfollow(@PathVariable("followeeId") Long followeeId) {
        followService.unfollow(authService.getCurrentUserId(), followeeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/followers")
    public Page<UserSummaryDto> getFollowers(@PathVariable("userId") Long userId,
                                             @PageableDefault(size=20) Pageable pageable
    ) {
        return followService.getFollowers(userId, pageable);
    }

    @GetMapping("/{userId}/following")
    public Page<UserSummaryDto> getFollowing(@PathVariable("userId") Long userId,
                                             @PageableDefault(size=20) Pageable pageable
    ) {
        return followService.getFollowing(userId, pageable);
    }

    @GetMapping("/{userId}/counts")
    public FollowCountsDto getCounts(@PathVariable("userId") Long userId) {
        return followService.getCounts(userId);
    }

    @GetMapping("/{userId}/is-following")
    public Map<String, Boolean> isFollowing(@PathVariable("userId") Long userId) {
        return Map.of("following", followService.isFollowing(authService.getCurrentUserId(), userId));
    }

}
