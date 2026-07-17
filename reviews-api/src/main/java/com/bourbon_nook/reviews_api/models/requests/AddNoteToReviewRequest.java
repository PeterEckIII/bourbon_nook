package com.bourbon_nook.reviews_api.models.requests;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class AddNoteToReviewRequest {
    @NotNull(message = "Category ID is required")
    private String categoryId;

    @NotNull(message = "Name is required")
    private String name;

    @NotNull(message = "Score is required")
    @Min(0) @Max(10)
    private Integer score;

    public AddNoteToReviewRequest() {}

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}
