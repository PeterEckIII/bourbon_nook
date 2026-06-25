package com.bourbon_nook.users_api.models.responses;

import java.util.List;

public class UserResponseModel {
    private String userId;
    private String email;
    private String username;
    private List<BottleResponseModel> bottles;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<BottleResponseModel> getBottles() {
        return bottles;
    }

    public void setBottles(List<BottleResponseModel> bottles) {
        this.bottles = bottles;
    }
}
