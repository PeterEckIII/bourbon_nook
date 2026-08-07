package com.bourbon_nook.users_api.entities;

import com.bourbon_nook.users_api.enums.FollowStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "follows", indexes = {
        @Index(name = "idx_follower", columnList = "follower_id"),
        @Index(name = "idx_followee", columnList = "followee_id")
})
public class FollowEntity {
    @EmbeddedId
    private FollowId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("followerId")
    @JoinColumn(name = "follower_id")
    private UserEntity follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("followeeId")
    @JoinColumn(name = "followee_id")
    private UserEntity followee;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private FollowStatus status = FollowStatus.ACTIVE;

    protected FollowEntity() {}

    public FollowEntity(UserEntity follower, UserEntity followee) {
        this.follower = follower;
        this.followee = followee;
        this.id = new FollowId(follower.getId(), followee.getId());
    }

    public FollowId getId() {
        return id;
    }

    public void setId(FollowId id) {
        this.id = id;
    }

    public UserEntity getFollower() {
        return follower;
    }

    public void setFollower(UserEntity follower) {
        this.follower = follower;
    }

    public UserEntity getFollowee() {
        return followee;
    }

    public void setFollowee(UserEntity followee) {
        this.followee = followee;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public FollowStatus getStatus() {
        return status;
    }

    public void setStatus(FollowStatus status) {
        this.status = status;
    }
}
