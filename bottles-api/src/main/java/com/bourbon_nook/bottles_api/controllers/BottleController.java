package com.bourbon_nook.bottles_api.controllers;

import com.bourbon_nook.bottles_api.dtos.BottleDto;
import com.bourbon_nook.bottles_api.models.responses.BottleResponseModel;
import com.bourbon_nook.bottles_api.services.BottleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/users/{id}/bottles")
public class BottleController {
    Logger logger = LoggerFactory.getLogger(BottleController.class);

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

    @GetMapping
    public List<BottleResponseModel> userBottles(@PathVariable String id) {
        List<BottleDto> bottles = bottleService.getUserBottles(id);
        List<BottleResponseModel> returnValue = new ArrayList<>();

        if(bottles == null || bottles.isEmpty()) {
            return returnValue;
        }

        for (BottleDto bottle : bottles) {
            BottleResponseModel model = new BottleResponseModel();
            model.setId(bottle.id());
            model.setUserId(bottle.userId());
            model.setName(bottle.name());
            model.setType(bottle.type());
            model.setDistillery(bottle.distillery());
            returnValue.add(model);
        }

        logger.info("Returning {} bottles for id {}", returnValue.size(), id);

        return returnValue;
    }
}
