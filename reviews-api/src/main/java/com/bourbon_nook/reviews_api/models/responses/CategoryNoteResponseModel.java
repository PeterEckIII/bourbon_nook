package com.bourbon_nook.reviews_api.models.responses;

import java.util.List;

public class CategoryNoteResponseModel {
    private String id;
    private String name;
    private List<NoteResponseModel> systemNotes;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<NoteResponseModel> getSystemNotes() {
        return systemNotes;
    }

    public void setSystemNotes(List<NoteResponseModel> systemNotes) {
        this.systemNotes = systemNotes;
    }
}
