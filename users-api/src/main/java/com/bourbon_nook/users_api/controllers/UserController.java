package com.bourbon_nook.users_api.controllers;

import com.bourbon_nook.users_api.dtos.UserDto;
import com.bourbon_nook.users_api.models.requests.CreateUserRequest;
import com.bourbon_nook.users_api.models.responses.CreateUserResponse;
import com.bourbon_nook.users_api.services.UserService;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final Environment env;
    private final UserService userService;

    public UserController(Environment env, UserService userService) {
        this.env = env;
        this.userService = userService;
    }

    @GetMapping("/status/healthcheck")
    public String healthcheck() {
        return "Working on port " +  env.getProperty("local.server.port") + ", with token " + env.getProperty("token.secret");
    }

    @GetMapping("/all")
    public String getUsers() {
        return "Working on port " + env.getProperty("local.server.port");
    }

    @PostMapping("/new")
    public ResponseEntity<CreateUserResponse> createUser(@RequestBody CreateUserRequest createUserRequest) {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        UserDto userDto = modelMapper.map(createUserRequest, UserDto.class);
        UserDto createdUser = userService.createUser(userDto);

        CreateUserResponse createUserResponse = modelMapper.map(createdUser, CreateUserResponse.class);

        return ResponseEntity.status(HttpStatus.CREATED).body(createUserResponse);
    }
}