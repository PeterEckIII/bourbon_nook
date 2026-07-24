package com.bourbon_nook.users_api.controllers;

import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final Environment env;

    public UserController(Environment env) {
        this.env = env;
    }

    @GetMapping("/status/healthcheck")
    public String healthcheck() {
        return "Working on port " + env.getProperty("local.server.port");
    }

    @GetMapping("/all")
    public String getUsers() {
        return "All users";
    }
}