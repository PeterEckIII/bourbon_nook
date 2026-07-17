package com.bourbon_nook.reviews_api.mappers;

import com.bourbon_nook.reviews_api.dtos.ReviewDto;
import com.bourbon_nook.reviews_api.dtos.ReviewNoteDto;
import com.bourbon_nook.reviews_api.entities.ReviewEntity;
import com.bourbon_nook.reviews_api.entities.ReviewNoteEntity;
import com.bourbon_nook.reviews_api.models.requests.CreateReviewRequest;
import com.bourbon_nook.reviews_api.models.responses.ReviewNoteResponseModel;
import com.bourbon_nook.reviews_api.models.responses.ReviewResponseModel;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public ReviewDto fromCreateRequest(CreateReviewRequest request, String userId) {
        if (request == null) return null;

        return new ReviewDto(
                null,
                request.getBottleId(),
                userId,
                request.getSetting(),
                request.getReviewDate(),
                request.getRestTimeMin(),
                request.getGlassware(),
                request.getNose(),
                request.getPalate(),
                request.getFinish(),
                request.getThoughts(),
                request.getValueScore(),
                request.getOverallRating(),
                null
        );
    }

    public ReviewDto toDto(ReviewEntity reviewEntity) {
        if(reviewEntity == null) return null;

        return new ReviewDto(
                reviewEntity.getId(),
                reviewEntity.getUserId(),
                reviewEntity.getBottleId(),
                reviewEntity.getSetting(),
                reviewEntity.getReviewDate(),
                reviewEntity.getRestTimeMin(),
                reviewEntity.getGlassware(),
                reviewEntity.getNose(),
                reviewEntity.getPalate(),
                reviewEntity.getFinish(),
                reviewEntity.getThoughts(),
                reviewEntity.getValueScore(),
                reviewEntity.getOverallRating(),
                reviewEntity.getReviewNotes().stream().map(this::toReviewNoteDto).toList()
        );
    }

    private ReviewNoteDto toReviewNoteDto(ReviewNoteEntity reviewNoteEntity) {
        return new ReviewNoteDto(
                reviewNoteEntity.getNote().getId(),
                reviewNoteEntity.getNote().getName(),
                reviewNoteEntity.getNote().getCategory().getId(),
                reviewNoteEntity.getNote().getCategory().getName(),
                reviewNoteEntity.getScore()
        );
    }

    public ReviewEntity toEntity(ReviewDto reviewDto) {
        if(reviewDto == null) return null;

        ReviewEntity reviewEntity = new ReviewEntity();
        reviewEntity.setBottleId(reviewDto.bottleId());
        reviewEntity.setUserId(reviewDto.userId());
        reviewEntity.setSetting(reviewDto.setting());
        reviewEntity.setReviewDate(reviewDto.reviewDate());
        reviewEntity.setRestTimeMin(reviewDto.restTimeMin());
        reviewEntity.setGlassware(reviewDto.glassware());
        reviewEntity.setNose(reviewDto.nose());
        reviewEntity.setPalate(reviewDto.palate());
        reviewEntity.setFinish(reviewDto.finish());
        reviewEntity.setThoughts(reviewDto.thoughts());
        reviewEntity.setValueScore(reviewDto.valueScore());
        reviewEntity.setOverallRating(reviewDto.overallRating());

        return reviewEntity;
    }

    public ReviewResponseModel toResponseModel(ReviewDto dto) {
        if(dto == null) return null;

        ReviewResponseModel model = new ReviewResponseModel();
        model.setId(dto.id());
        model.setBottleId(dto.bottleId());
        model.setSetting(dto.setting());
        model.setReviewDate(dto.reviewDate());
        model.setRestTimeMin(dto.restTimeMin());
        model.setGlassware(dto.glassware());
        model.setNose(dto.nose());
        model.setPalate(dto.palate());
        model.setFinish(dto.finish());
        model.setThoughts(dto.thoughts());
        model.setValueScore(dto.valueScore());
        model.setOverallRating(dto.overallRating());
        model.setReviewNotes(dto.reviewNotes() == null
                ? null
                : dto.reviewNotes().stream().map(this::toReviewNoteResponseModel).toList());

        return model;

    }

    private ReviewNoteResponseModel toReviewNoteResponseModel(ReviewNoteDto reviewNoteDto) {
        ReviewNoteResponseModel model = new ReviewNoteResponseModel();
        model.setNoteId(reviewNoteDto.noteId());
        model.setNoteName(reviewNoteDto.noteName());
        model.setCategoryId(reviewNoteDto.categoryId());
        model.setCategoryName(reviewNoteDto.categoryName());
        model.setScore(reviewNoteDto.score());
        return model;
    }
}
