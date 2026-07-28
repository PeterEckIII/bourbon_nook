package com.bourbon_nook.users_api.controllers;

import com.bourbon_nook.users_api.dtos.UserDto;
import com.bourbon_nook.users_api.models.requests.UpdateUserRequest;
import com.bourbon_nook.users_api.models.responses.UserResponseModel;
import com.bourbon_nook.users_api.services.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final Environment env;
    private final UserService userService;
    private final ModelMapper modelMapper;

    public UserController(Environment env, UserService userService, ModelMapper modelMapper) {
        this.env = env;
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/status/healthcheck")
    public String healthcheck() {
        return "Working on port " + env.getProperty("local.server.port");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<UserResponseModel>> getUsers() {
        List<UserDto> users = userService.getUsers();
        List<UserResponseModel> usersResponse = new ArrayList<>();
        users.forEach(user -> usersResponse.add(modelMapper.map(user, UserResponseModel.class)));
        return ResponseEntity.ok().body(usersResponse);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseModel> getUser(@PathVariable String id) {
        UserDto user = userService.getUserByUserId(id);
        return ResponseEntity.ok().body(modelMapper.map(user, UserResponseModel.class));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseModel> updateUser(@PathVariable String id,
                                                        @RequestBody UpdateUserRequest updateUserRequest
    ) {
        UserDto user = userService.updateUser(id, updateUserRequest);
        return ResponseEntity.ok().body(modelMapper.map(user, UserResponseModel.class));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<UserResponseModel> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}