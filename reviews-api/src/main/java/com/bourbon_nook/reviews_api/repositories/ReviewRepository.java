package com.bourbon_nook.reviews_api.repositories;

import com.bourbon_nook.reviews_api.entities.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, String> {
    List<ReviewEntity> findAllByUserId(String userId);
    ReviewEntity findByIdAndUserId(String reviewId, String userId);
}
