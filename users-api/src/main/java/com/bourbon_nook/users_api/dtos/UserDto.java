package com.bourbon_nook.users_api.dtos;

import com.bourbon_nook.users_api.models.responses.BottleResponseModel;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

public class UserDto implements Serializable {

    @Serial
    private static final long serialVersionUID = -9219133981870221671L;

    private String email;
    private String username;
    private String password;
    private String userId;
    private String encryptedPassword;
    private List<BottleResponseModel> bottles;

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEncryptedPassword() {
        return encryptedPassword;
    }

    public void setEncryptedPassword(String encryptedPassword) {
        this.encryptedPassword = encryptedPassword;
    }

    public List<BottleResponseModel> getBottles() {
        return bottles;
    }

    public void setBottles(List<BottleResponseModel> bottles) {
        this.bottles = bottles;
    }
}