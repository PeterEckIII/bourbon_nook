package com.bourbon_nook.users_api.services;

import com.bourbon_nook.users_api.dtos.FollowCountsDto;
import com.bourbon_nook.users_api.dtos.UserSummaryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FollowService {
    void follow(String followerId, String followeeId);
    void unfollow(String followerId, String followeeId);
    boolean isFollowing(String followerId, String followeeId);
    boolean isMutual(String userAId, String userBId);
    Page<UserSummaryDto> getFollowers(String userId, Pageable pageable);
    Page<UserSummaryDto> getFollowing(String userId, Pageable pageable);
    FollowCountsDto getCounts(String userId);
}
