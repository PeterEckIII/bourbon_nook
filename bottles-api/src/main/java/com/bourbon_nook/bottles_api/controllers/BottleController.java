package com.bourbon_nook.bottles_api.controllers;

import com.bourbon_nook.bottles_api.services.BottleService;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bottles")
public class BottleController {
    private final Environment env;
    private final BottleService bottleService;

    public BottleController(Environment env, BottleService bottleService) {
        this.env = env;
        this.bottleService = bottleService;
    }

    @GetMapping("/status/healthcheck")
    public String healthcheck() {
        return "Bottles: Working on port " + env.getProperty("local.server.port");
    }

    @GetMapping("/all")
    public String getBottles() {
        return "All bottles";
    }
}
