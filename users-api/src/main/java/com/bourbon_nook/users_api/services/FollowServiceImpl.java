package com.bourbon_nook.users_api.services;

import com.bourbon_nook.users_api.dtos.FollowCountsDto;
import com.bourbon_nook.users_api.dtos.UserSummaryDto;
import com.bourbon_nook.users_api.entities.FollowEntity;
import com.bourbon_nook.users_api.entities.UserEntity;
import com.bourbon_nook.users_api.exceptions.AlreadyFollowingException;
import com.bourbon_nook.users_api.exceptions.FollowException;
import com.bourbon_nook.users_api.exceptions.InvalidFollowerException;
import com.bourbon_nook.users_api.exceptions.NotFollowingException;
import com.bourbon_nook.users_api.exceptions.SelfFollowException;
import com.bourbon_nook.users_api.exceptions.UserNotFoundException;
import com.bourbon_nook.users_api.repositories.FollowRepository;
import com.bourbon_nook.users_api.repositories.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class FollowServiceImpl implements FollowService {
    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    public FollowServiceImpl(FollowRepository followRepository, UserRepository userRepository) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
    }


    @Override
    public void follow(Long followerId, Long followeeId) {
        if(followerId.equals(followeeId)) {
            throw new SelfFollowException("Cannot follow yourself");
        }

        if(followRepository.existsByFollower_IdAndFollowee_Id(followerId, followeeId)) {
            throw new AlreadyFollowingException("You're already following this user");
        }

        if(!userRepository.existsById(followerId)) {
            throw new InvalidFollowerException("Authenticated user " + followerId + " could not be found");
        }

        UserEntity follower = userRepository.getReferenceById(followerId);
        UserEntity followee = userRepository.findById(followeeId).orElseThrow(() -> new UserNotFoundException("Cannot find user " + followeeId));

        FollowEntity follow = new FollowEntity(follower, followee);
        try {
            followRepository.save(follow);
        } catch (DataIntegrityViolationException ex) {
            throw new FollowException("Unable to complete follow request");
        }
    }

    @Override
    public void unfollow(Long followerId, Long followeeId) {
        if(!followRepository.existsByFollower_IdAndFollowee_Id(followerId, followeeId)) {
            throw new NotFollowingException("You're not following this user");
        }
        followRepository.deleteByFollower_IdAndFollowee_Id(followerId, followeeId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFollowing(Long followerId, Long followeeId) {
        return followRepository.existsByFollower_IdAndFollowee_Id(followerId, followeeId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isMutual(Long userAId, Long userBId) {
        return isFollowing(userAId, userBId) && isFollowing(userBId, userAId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryDto> getFollowers(Long userId, Pageable pageable) {
        return followRepository.findByFollowee_Id(userId, pageable)
                .map(f -> UserSummaryDto.from(f.getFollower()));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryDto> getFollowing(Long userId, Pageable pageable) {
        return followRepository.findByFollower_Id(userId, pageable)
                .map(f -> UserSummaryDto.from(f.getFollowee()));
    }

    @Override
    @Transactional(readOnly = true)
    public FollowCountsDto getCounts(Long userId) {
        long followers = followRepository.countFollowers(userId);
        long following = followRepository.countFollowing(userId);
        return new FollowCountsDto(followers, following);
    }
}
