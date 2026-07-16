package com.bourbon_nook.reviews_api.models.requests;

import com.bourbon_nook.reviews_api.entities.ReviewNoteEntity;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Set;

public class CreateReviewRequest {
    @NotNull(message = "Setting is required")
    private String setting;

    @NotNull(message = "Review date is required")
    private LocalDate reviewDate;

    @NotNull(message = "Rest time is required")
    private Integer restTimeMin;

    @NotNull(message = "Glassware is required")
    private String glassware;

    @NotNull(message = "Nose is required")
    private String nose;

    @NotNull(message = "Palate is required")
    private String palate;

    @NotNull(message = "Finish is required")
    private String finish;

    @NotNull(message = "Final thoughts is required")
    private String thoughts;

    @NotNull(message = "Value is required")
    private Integer valueScore;

    @NotNull(message = "Overall rating is required")
    private Integer overallRating;

    private Set<ReviewNoteEntity>  reviewNotes;

    public CreateReviewRequest() {}

    public String getSetting() {
        return setting;
    }

    public void setSetting(String setting) {
        this.setting = setting;
    }

    public LocalDate getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(LocalDate reviewDate) {
        this.reviewDate = reviewDate;
    }

    public Integer getRestTimeMin() {
        return restTimeMin;
    }

    public void setRestTimeMin(Integer restTimeMin) {
        this.restTimeMin = restTimeMin;
    }

    public String getGlassware() {
        return glassware;
    }

    public void setGlassware(String glassware) {
        this.glassware = glassware;
    }

    public String getNose() {
        return nose;
    }

    public void setNose(String nose) {
        this.nose = nose;
    }

    public String getPalate() {
        return palate;
    }

    public void setPalate(String palate) {
        this.palate = palate;
    }

    public String getFinish() {
        return finish;
    }

    public void setFinish(String finish) {
        this.finish = finish;
    }

    public String getThoughts() {
        return thoughts;
    }

    public void setThoughts(String thoughts) {
        this.thoughts = thoughts;
    }

    public Integer getValueScore() {
        return valueScore;
    }

    public void setValueScore(Integer valueScore) {
        this.valueScore = valueScore;
    }

    public Integer getOverallRating() {
        return overallRating;
    }

    public void setOverallRating(Integer overallRating) {
        this.overallRating = overallRating;
    }

    public Set<ReviewNoteEntity> getReviewNotes() {
        return reviewNotes;
    }

    public void setReviewNotes(Set<ReviewNoteEntity> reviewNotes) {
        this.reviewNotes = reviewNotes;
    }
}
