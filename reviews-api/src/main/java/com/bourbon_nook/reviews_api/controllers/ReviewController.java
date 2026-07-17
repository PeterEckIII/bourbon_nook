package com.bourbon_nook.reviews_api.controllers;

import com.bourbon_nook.reviews_api.dtos.ReviewDto;
import com.bourbon_nook.reviews_api.mappers.ReviewMapper;
import com.bourbon_nook.reviews_api.models.requests.AddNoteToReviewRequest;
import com.bourbon_nook.reviews_api.models.requests.CreateReviewRequest;
import com.bourbon_nook.reviews_api.models.responses.ReviewResponseModel;
import com.bourbon_nook.reviews_api.services.NoteService;
import com.bourbon_nook.reviews_api.services.ReviewService;
import jakarta.validation.Valid;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController()
@RequestMapping("/reviews")
public class ReviewController {

    private final Environment environment;
    private final ReviewService reviewService;
    private final ReviewMapper reviewMapper;
    private final NoteService noteService;

    public ReviewController(Environment environment, ReviewService reviewService, ReviewMapper reviewMapper, NoteService noteService) {
        this.environment = environment;
        this.reviewService = reviewService;
        this.reviewMapper = reviewMapper;
        this.noteService = noteService;
    }

    @GetMapping("/status/healthcheck")
    public String healthcheck() { return "Reviews: Working on port " + environment.getProperty("local.server.port"); }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<ReviewResponseModel>> userReviews(Authentication authentication) {
        String userId = authentication.getName();
        List<ReviewDto> reviews = reviewService.getUserReviews(userId);
        List<ReviewResponseModel> returnValue = new ArrayList<>();

        if(reviews == null || reviews.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(returnValue);
        }

        for(ReviewDto review : reviews) {
            ReviewResponseModel responseModel = reviewMapper.toResponseModel(review);
            returnValue.add(responseModel);
        }

        return ResponseEntity.status(HttpStatus.OK).body(returnValue);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewResponseModel> review(@PathVariable String reviewId,
                                                      Authentication authentication
    ) {
        String userId = authentication.getName();
        ReviewDto review = reviewService.getReviewByIdAndUserId(reviewId, userId);
        if(review == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        ReviewResponseModel responseModel = reviewMapper.toResponseModel(review);
        return ResponseEntity.status(HttpStatus.OK).body(responseModel);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/new")
    public ResponseEntity<ReviewResponseModel> reviewCreate(@Valid @RequestBody CreateReviewRequest createReviewRequest,
                                                            Authentication authentication
    ) {
        String userId = authentication.getName();
        ReviewDto reviewDto = reviewMapper.fromCreateRequest(createReviewRequest, userId);
        ReviewDto createdReview = reviewService.createReview(userId, reviewDto);
        ReviewResponseModel returnValue = reviewMapper.toResponseModel(createdReview);
        return ResponseEntity.status(HttpStatus.OK).body(returnValue);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponseModel> reviewUpdate(@PathVariable String reviewId,
                                                            @Valid @RequestBody CreateReviewRequest createReviewRequest,
                                                            Authentication authentication
    ) {
        String userId = authentication.getName();
        ReviewDto reviewDto = reviewMapper.fromCreateRequest(createReviewRequest, userId);
        ReviewDto updatedReviewDto = reviewService.updateReview(userId, reviewId, reviewDto);
        if(updatedReviewDto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        ReviewResponseModel responseModel = reviewMapper.toResponseModel(updatedReviewDto);
        return ResponseEntity.status(HttpStatus.OK).body(responseModel);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/{reviewId}/notes")
    public ResponseEntity<Void> addNoteToReview(@PathVariable String reviewId,
                                                @Valid @RequestBody AddNoteToReviewRequest request,
                                                Authentication authentication
    ) {
        String userId = authentication.getName();
        reviewService.addNoteToReview(reviewId, request.getCategoryId(), request.getName(), request.getScore(), userId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{reviewId}/notes/{noteId}")
    public ResponseEntity<Void> deleteNoteFromReview(@PathVariable String reviewId, @PathVariable String noteId, Authentication authentication) {
        String userId = authentication.getName();
        reviewService.removeNoteFromReview(reviewId, noteId, userId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void>  reviewDelete(@PathVariable String reviewId, Authentication authentication) {
        String userId = authentication.getName();
        if(!reviewService.deleteReview(userId, reviewId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.noContent().build();
    }
}
