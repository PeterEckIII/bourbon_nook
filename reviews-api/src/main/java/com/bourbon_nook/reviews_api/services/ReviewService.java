package com.bourbon_nook.reviews_api.services;

import com.bourbon_nook.reviews_api.dtos.AddNoteToReviewDto;
import com.bourbon_nook.reviews_api.dtos.ReviewDto;

import java.util.List;

public interface ReviewService {
    List<ReviewDto> getUserReviews(String userId);
    ReviewDto getReviewByIdAndUserId(String id, String userId);

    ReviewDto createReview(String userId, ReviewDto reviewDto);
    ReviewDto updateReview(String userId, String id, ReviewDto reviewDto);
    void addNoteToReview(String reviewId,
                         String categoryId,
                         String noteName,
                         Integer score,
                         String userId
    );
    void addNotesToReview(String reviewId, List<AddNoteToReviewDto> notes, String userId);
    void removeNoteFromReview(String reviewId, String noteId, String userId);
    boolean deleteReview(String userId, String id);
}
