package com.bourbon_nook.reviews_api.models.responses;

import com.bourbon_nook.reviews_api.entities.ReviewNoteEntity;

import java.time.LocalDate;
import java.util.Set;

public class ReviewResponseModel {
    private String id;
    private String setting;
    private LocalDate reviewDate;
    private Integer restTimeMin;
    private String glassware;
    private String nose;
    private String palate;
    private String finish;
    private String thoughts;
    private Integer valueScore;
    private Integer overallRating;
    private Set<ReviewNoteEntity> reviewNotes;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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
