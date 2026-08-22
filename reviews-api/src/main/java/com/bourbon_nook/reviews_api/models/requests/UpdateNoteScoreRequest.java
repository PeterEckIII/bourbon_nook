package com.bourbon_nook.reviews_api.models.requests;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class UpdateNoteScoreRequest {
    @NotNull(message = "Score is required")
    @Min(0) @Max(10)
    private Integer score;

    public UpdateNoteScoreRequest() {}

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}
