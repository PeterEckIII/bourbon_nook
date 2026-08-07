package com.bourbon_nook.users_api.services;

import com.bourbon_nook.users_api.dtos.UserDto;

public interface AuthService {
    UserDto getCurrentUser();
    Long getCurrentUserId();
    boolean verifyPassword(String email, String password);
    void updatePassword(String email, String password);
}
