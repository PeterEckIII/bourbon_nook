package com.bourbon_nook.users_api.repositories;

import com.bourbon_nook.users_api.entities.FollowEntity;
import com.bourbon_nook.users_api.entities.FollowId;
import feign.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepository extends JpaRepository<FollowEntity, FollowId> {
    boolean existsByFollower_IdAndFollowee_Id(Long followerId, Long followeeId);

    Page<FollowEntity> findByFollower_Id(Long followerId, Pageable pageable);
    Page<FollowEntity> findByFollowee_Id(Long followeeId, Pageable pageable);

    @Query("select count(f) from FollowEntity f where f.followee.id = :userId")
    long countFollowers(@Param("userId") Long userId);

    @Query("select count(f) from FollowEntity f where f.follower.id = :userId")
    long countFollowing(@Param("userId") Long userId);

    void deleteByFollower_IdAndFollowee_Id(Long followerId, Long followeeId);


}
