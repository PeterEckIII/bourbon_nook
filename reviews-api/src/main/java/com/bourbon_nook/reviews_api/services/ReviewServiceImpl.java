package com.bourbon_nook.reviews_api.services;

import com.bourbon_nook.reviews_api.dtos.ReviewDto;
import com.bourbon_nook.reviews_api.entities.NoteEntity;
import com.bourbon_nook.reviews_api.entities.ReviewEntity;
import com.bourbon_nook.reviews_api.exceptions.ReviewNotFoundException;
import com.bourbon_nook.reviews_api.mappers.ReviewMapper;
import com.bourbon_nook.reviews_api.repositories.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final NoteService noteService;

    public ReviewServiceImpl(ReviewRepository reviewRepository, ReviewMapper reviewMapper, NoteService noteService) {
        this.reviewRepository = reviewRepository;
        this.reviewMapper = reviewMapper;
        this.noteService = noteService;
    }

    @Override
    public List<ReviewDto> getUserReviews(String userId) {
        return reviewRepository
                .findAllByUserId(userId)
                .stream()
                .map(reviewMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewDto getReviewByIdAndUserId(String userId, String id) {
        ReviewEntity review = reviewRepository.findByIdAndUserId(id, userId);
        return reviewMapper.toDto(review);
    }

    @Override
    public ReviewDto createReview(String userId, ReviewDto reviewDto) {
        ReviewEntity review = reviewMapper.toEntity(reviewDto);
        review.setUserId(userId);
        reviewRepository.save(review);
        return reviewMapper.toDto(review);
    }

    @Override
    public ReviewDto updateReview(String userId, String id, ReviewDto reviewDto) {
        ReviewEntity existingReview = reviewRepository.findByIdAndUserId(id, userId);
        if(existingReview == null) {
            return null;
        }

        existingReview.setUserId(userId);
        existingReview.setSetting(reviewDto.setting());
        existingReview.setReviewDate(reviewDto.reviewDate());
        existingReview.setRestTimeMin(reviewDto.restTimeMin());
        existingReview.setGlassware(reviewDto.glassware());
        existingReview.setNose(reviewDto.nose());
        existingReview.setPalate(reviewDto.palate());
        existingReview.setFinish(reviewDto.finish());
        existingReview.setThoughts(reviewDto.thoughts());
        existingReview.setValueScore(reviewDto.valueScore());
        existingReview.setOverallRating(reviewDto.overallRating());
        existingReview.setReviewNotes(reviewDto.reviewNotes());

        return reviewMapper.toDto(existingReview);
    }

    @Override
    public void addNoteToReview(String reviewId,
                                String categoryId,
                                String noteName,
                                Integer score,
                                String userId
    ) {
        ReviewEntity review = reviewRepository
                .findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("Review with id: " + reviewId + " not found"));

        NoteEntity note = noteService.findOrCreateNote(categoryId, noteName, userId);
    }

    @Override
    public void removeNoteFromReview(String reviewId, String noteId) {
        ReviewEntity review = reviewRepository
                .findById(reviewId)
                .orElseThrow(() -> new ReviewNotFoundException("Review with id: " + reviewId + " not found"));

        NoteEntity note = noteService
                .findById(noteId)
                .orElseThrow(() -> new ReviewNotFoundException("Note with id: " + noteId + " not found"));

        review.removeNote(note);
        reviewRepository.save(review);
    }

    @Override
    public boolean deleteReview(String userId, String id) {
        ReviewEntity existingReview = reviewRepository.findByIdAndUserId(id, userId);
        if(existingReview == null) return false;
        reviewRepository.delete(existingReview);
        return true;
    }
}
