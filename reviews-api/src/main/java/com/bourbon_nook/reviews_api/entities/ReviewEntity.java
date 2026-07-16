package com.bourbon_nook.reviews_api.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "reviews", indexes = {
        @Index(name = "idx_user", columnList = "user_id"),
        @Index(name = "idx_bottle", columnList = "bottle_id")
})
public class ReviewEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotNull
    @Column(name = "bottle_id", nullable = false)
    private String bottleId;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(length = 255)
    private String setting;

    @NotNull
    @Column(name = "review_date", nullable = false)
    private LocalDate reviewDate;

    @Column(name = "rest_time_min")
    private Integer restTimeMin;

    @Column(length = 100)
    private String glassware;

    @Column(columnDefinition = "TEXT")
    private String nose;

    @Column(columnDefinition = "TEXT")
    private String palate;

    @Column(columnDefinition = "TEXT")
    private String finish;

    @Column(columnDefinition = "TEXT")
    private String thoughts;

    @Min(0) @Max(10)
    @Column(name = "value_score")
    private Integer valueScore;

    @Min(0) @Max(10)
    @Column(name = "overall_rating")
    private Integer overallRating;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ReviewNoteEntity> reviewNotes = new HashSet<>();

    public void addNote(NoteEntity note, int score) {
        ReviewNoteEntity reviewNote = new ReviewNoteEntity(this, note, score);
        reviewNotes.add(reviewNote);
    }

    public void removeNote(NoteEntity note) {
        reviewNotes.removeIf(rn -> rn.getNote().equals(note));
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBottleId() {
        return bottleId;
    }

    public void setBottleId(String bottleId) {
        this.bottleId = bottleId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<ReviewNoteEntity> getReviewNotes() {
        return reviewNotes;
    }

    public void setReviewNotes(Set<ReviewNoteEntity> reviewNotes) {
        this.reviewNotes = reviewNotes;
    }
}
