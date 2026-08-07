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
    public void follow(String followerId, String followeeId) {
        if(followerId.equals(followeeId)) {
            throw new SelfFollowException("Cannot follow yourself");
        }

        UserEntity follower = userRepository.findByUserId(followerId);
        if(follower == null) {
            throw new InvalidFollowerException("Authenticated user " + followerId + " could not be found");
        }

        UserEntity followee = userRepository.findByUserId(followeeId);
        if(followee == null) {
            throw new UserNotFoundException("Cannot find user " + followeeId);
        }

        if(followRepository.existsByFollower_IdAndFollowee_Id(follower.getId(), followee.getId())) {
            throw new AlreadyFollowingException("You're already following this user");
        }

        FollowEntity follow = new FollowEntity(follower, followee);
        try {
            followRepository.save(follow);
        } catch (DataIntegrityViolationException ex) {
            throw new FollowException("Unable to complete follow request");
        }
    }

    @Override
    public void unfollow(String followerId, String followeeId) {
        UserEntity follower = userRepository.findByUserId(followerId);
        if(follower == null) {
            throw new InvalidFollowerException("Authenticated user " + followerId + " could not be found");
        }

        UserEntity followee = userRepository.findByUserId(followeeId);
        if(followee == null) {
            throw new UserNotFoundException("Cannot find user " + followeeId);
        }

        if(!followRepository.existsByFollower_IdAndFollowee_Id(follower.getId(), followee.getId())) {
            throw new NotFollowingException("You're not following this user");
        }
        followRepository.deleteByFollower_IdAndFollowee_Id(follower.getId(), followee.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFollowing(String followerId, String followeeId) {
        UserEntity follower = userRepository.findByUserId(followerId);
        UserEntity followee = userRepository.findByUserId(followeeId);
        if(follower == null || followee == null) {
            return false;
        }
        return followRepository.existsByFollower_IdAndFollowee_Id(follower.getId(), followee.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isMutual(String userAId, String userBId) {
        return isFollowing(userAId, userBId) && isFollowing(userBId, userAId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryDto> getFollowers(String userId, Pageable pageable) {
        UserEntity user = userRepository.findByUserId(userId);
        if(user == null) {
            throw new UserNotFoundException("Cannot find user " + userId);
        }
        return followRepository.findByFollowee_Id(user.getId(), pageable)
                .map(f -> UserSummaryDto.from(f.getFollower()));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryDto> getFollowing(String userId, Pageable pageable) {
        UserEntity user = userRepository.findByUserId(userId);
        if(user == null) {
            throw new UserNotFoundException("Cannot find user " + userId);
        }
        return followRepository.findByFollower_Id(user.getId(), pageable)
                .map(f -> UserSummaryDto.from(f.getFollowee()));
    }

    @Override
    @Transactional(readOnly = true)
    public FollowCountsDto getCounts(String userId) {
        UserEntity user = userRepository.findByUserId(userId);
        if(user == null) {
            throw new UserNotFoundException("Cannot find user " + userId);
        }
        long followers = followRepository.countFollowers(user.getId());
        long following = followRepository.countFollowing(user.getId());
        return new FollowCountsDto(followers, following);
    }
}
