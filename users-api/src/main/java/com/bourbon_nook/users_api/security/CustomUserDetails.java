package com.bourbon_nook.users_api.security;

import com.bourbon_nook.users_api.entities.UserEntity;
import org.springframework.security.core.userdetails.User;

import java.util.ArrayList;

public class CustomUserDetails extends User {
    private final String userId;

    public CustomUserDetails(UserEntity user) {
        super(user.getEmail(), user.getEncryptedPassword(), new ArrayList<>());
        this.userId = user.getUserId();
    }

    public String getUserId() {
        return userId;
    }
}
