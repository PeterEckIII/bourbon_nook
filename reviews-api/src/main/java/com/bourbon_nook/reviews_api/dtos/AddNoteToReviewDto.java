package com.bourbon_nook.reviews_api.dtos;

public record AddNoteToReviewDto(
        String categoryId,
        String noteName,
        Integer score
) {}
