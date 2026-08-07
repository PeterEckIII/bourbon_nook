package com.bourbon_nook.users_api.services;

import com.bourbon_nook.users_api.dtos.FollowCountsDto;
import com.bourbon_nook.users_api.dtos.UserSummaryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FollowService {
    void follow(Long followerId, Long followeeId);
    void unfollow(Long followerId, Long followeeId);
    boolean isFollowing(Long followerId, Long followeeId);
    boolean isMutual(Long userAId, Long userBId);
    Page<UserSummaryDto> getFollowers(Long userId, Pageable pageable);
    Page<UserSummaryDto> getFollowing(Long userId, Pageable pageable);
    FollowCountsDto getCounts(Long userId);
}
