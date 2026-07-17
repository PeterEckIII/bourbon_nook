package com.bourbon_nook.reviews_api.dtos;

public record ReviewNoteDto(
        String noteId,
        String noteName,
        String categoryId,
        String categoryName,
        Integer score
) {}
