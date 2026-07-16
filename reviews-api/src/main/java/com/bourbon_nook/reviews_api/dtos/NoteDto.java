package com.bourbon_nook.reviews_api.dtos;

public record NoteDto (
        String id,
        NoteCategoryDto category,
        String name,
        boolean system,
        String createdBy
) {}

