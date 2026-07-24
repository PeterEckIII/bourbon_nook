package com.bourbon_nook.users_api.services;

import com.bourbon_nook.users_api.entities.UserEntity;

public interface AuthService {
    UserEntity getCurrentUser();
}
