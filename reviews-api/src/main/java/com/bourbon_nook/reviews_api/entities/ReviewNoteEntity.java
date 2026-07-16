package com.bourbon_nook.reviews_api.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

@Entity
@Table(name = "review_notes")
public class ReviewNoteEntity implements Serializable {
    @EmbeddedId
    private ReviewNoteId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("reviewId")
    @JoinColumn(name = "review_id")
    private ReviewEntity reviewEntity;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("noteId")
    @JoinColumn(name = "note_id")
    private NoteEntity noteEntity;

    @NotNull
    @Min(0) @Max(10)
    @Column(nullable = false)
    private Integer score;

    protected ReviewNoteEntity() {}

    public ReviewNoteEntity(ReviewEntity reviewEntity, NoteEntity noteEntity, Integer score) {
        this.reviewEntity = reviewEntity;
        this.noteEntity = noteEntity;
        this.score = score;
        this.id = new ReviewNoteId(reviewEntity.getId(), noteEntity.getId());
    }

    public ReviewNoteId getId() { return id; }
    public ReviewEntity getReview() { return reviewEntity; }
    public NoteEntity getNote() { return noteEntity; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if(!(o instanceof ReviewNoteEntity other)) return false;
        return id != null && id.equals(other.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
