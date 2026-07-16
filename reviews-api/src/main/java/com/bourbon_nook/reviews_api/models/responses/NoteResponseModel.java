package com.bourbon_nook.reviews_api.models.responses;

import com.bourbon_nook.reviews_api.dtos.NoteCategoryDto;

public class NoteResponseModel {
    String noteId;
    NoteCategoryDto category;
    String name;
    Integer score;

    public String getNoteId() {
        return noteId;
    }

    public void setNoteId(String noteId) {
        this.noteId = noteId;
    }

    public NoteCategoryDto getCategory() {
        return category;
    }

    public void setCategory(NoteCategoryDto category) {
        this.category = category;
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
