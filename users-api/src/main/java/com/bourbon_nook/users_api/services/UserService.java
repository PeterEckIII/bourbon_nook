package com.bourbon_nook.users_api.services;

import com.bourbon_nook.users_api.dtos.UserDto;
import com.bourbon_nook.users_api.models.requests.UpdateUserRequest;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    List<UserDto> getUsers();
    UserDto getUserDetailsByEmail(String email);
    UserDto getUserByUserId(String userId);
    UserDto createUser(UserDto userDetails, String rawPassword);
    UserDto updateUser(String userId, UpdateUserRequest userDetails);
    void deleteUser(String userId);
    boolean isUsernameAvailable(String username);
    boolean isEmailAvailable(String email);
}
