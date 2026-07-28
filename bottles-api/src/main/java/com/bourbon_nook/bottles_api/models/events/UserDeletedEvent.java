package com.bourbon_nook.bottles_api.models.events;

public class UserDeletedEvent {
    private String userId;

    public UserDeletedEvent() {}
    public UserDeletedEvent(String userId) {
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
