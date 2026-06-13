package com.bourbon_nook.users_api.services;

import com.bourbon_nook.users_api.dtos.UserDto;
import com.bourbon_nook.users_api.models.requests.CreateUserRequest;

public interface UserService {
    UserDto createUser(UserDto userDetails);
}
