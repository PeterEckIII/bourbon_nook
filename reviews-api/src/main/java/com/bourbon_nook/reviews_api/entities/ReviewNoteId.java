package com.bourbon_nook.reviews_api.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ReviewNoteId implements Serializable {
    @Column(name = "review_id")
    private String reviewId;

    @Column(name = "note_id")
    private String noteId;

    protected ReviewNoteId() {}

    public ReviewNoteId(String reviewId, String noteId) {
        this.reviewId = reviewId;
        this.noteId = noteId;
    }

    public String getReviewId() {
        return reviewId;
    }

    public String getNoteId() {
        return noteId;
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) return true;
        if(!(o instanceof ReviewNoteId other)) return false;
        return Objects.equals(reviewId, other.reviewId) && Objects.equals(noteId, other.noteId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reviewId, noteId);
    }
}
