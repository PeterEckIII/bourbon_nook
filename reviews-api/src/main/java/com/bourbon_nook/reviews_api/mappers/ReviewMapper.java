package com.bourbon_nook.reviews_api.mappers;

import com.bourbon_nook.reviews_api.dtos.ReviewDto;
import com.bourbon_nook.reviews_api.entities.ReviewEntity;
import com.bourbon_nook.reviews_api.models.requests.CreateReviewRequest;
import com.bourbon_nook.reviews_api.models.responses.ReviewResponseModel;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public ReviewDto fromCreateRequest(CreateReviewRequest request) {
        if (request == null) return null;

        return new ReviewDto(
                null,
                null,
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
                request.getReviewNotes()
        );
    }

    public ReviewDto toDto(ReviewEntity reviewEntity) {
        if(reviewEntity == null) return null;

        return new ReviewDto(
                reviewEntity.getId(),
                reviewEntity.getUserId(),
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
                reviewEntity.getReviewNotes()
        );
    }

    public ReviewEntity toEntity(ReviewDto reviewDto) {
        if(reviewDto == null) return null;

        ReviewEntity reviewEntity = new ReviewEntity();
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
        reviewEntity.setReviewNotes(reviewDto.reviewNotes());

        return reviewEntity;
    }

    public ReviewResponseModel toResponseModel(ReviewDto dto) {
        if(dto == null) return null;

        ReviewResponseModel model = new ReviewResponseModel();
        model.setId(dto.id());
        model.setNose(dto.nose());
        model.setReviewDate(dto.reviewDate());
        model.setRestTimeMin(dto.restTimeMin());
        model.setGlassware(dto.glassware());
        model.setNose(dto.nose());
        model.setPalate(dto.palate());
        model.setFinish(dto.finish());
        model.setThoughts(dto.thoughts());
        model.setValueScore(dto.valueScore());
        model.setOverallRating(dto.overallRating());
        model.setReviewNotes(dto.reviewNotes());

        return model;

    }
}
