package com.bourbon_nook.reviews_api.models.requests;

import jakarta.validation.constraints.NotNull;

public class CreateNoteRequest {
    @NotNull
    private String categoryId;

    @NotNull(message = "Name is required")
    private String name;

    private boolean system;
    private String createdBy;

    public CreateNoteRequest() {}

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

    public boolean isSystem() {
        return system;
    }

    public void setSystem(boolean system) {
        this.system = system;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
