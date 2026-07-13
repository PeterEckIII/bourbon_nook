package com.bourbon_nook.bottles_api.controllers;

import com.bourbon_nook.bottles_api.dtos.BottleDto;
import com.bourbon_nook.bottles_api.mappers.BottleMapper;
import com.bourbon_nook.bottles_api.models.requests.CreateBottleRequest;
import com.bourbon_nook.bottles_api.models.responses.BottleResponseModel;
import com.bourbon_nook.bottles_api.services.BottleService;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/bottles")
public class BottleController {
    Logger logger = LoggerFactory.getLogger(BottleController.class);

    private final Environment env;
    private final BottleService bottleService;
    private final ModelMapper modelMapper;
    private final BottleMapper bottleMapper;

    public BottleController(Environment env, BottleService bottleService, ModelMapper modelMapper, BottleMapper bottleMapper) {
        this.env = env;
        this.bottleService = bottleService;
        this.modelMapper = modelMapper;
        this.bottleMapper = bottleMapper;
    }

    @GetMapping("/status/healthcheck")
    public String healthcheck() {
        return "Bottles: Working on port " + env.getProperty("local.server.port");
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<BottleResponseModel>> userBottles(Authentication authentication) {
        String userId = authentication.getName();
        List<BottleDto> bottles = bottleService.getUserBottles(userId);
        List<BottleResponseModel> returnValue = new ArrayList<>();

        if(bottles == null || bottles.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(returnValue);
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
        logger.info("Returning {} bottles for user id {}", returnValue.size(), userId);
        return ResponseEntity.status(HttpStatus.OK).body(returnValue);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{bottleId}")
    public ResponseEntity<BottleResponseModel> userBottle(@PathVariable String bottleId, Authentication authentication) {
        String userId = authentication.getName();
        BottleDto bottle = bottleService.getBottleByIdAndUserId(bottleId, userId);
        if(bottle == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        BottleResponseModel model = new BottleResponseModel();
        model.setId(bottle.id());
        model.setUserId(userId);
        model.setName(bottle.name());
        model.setType(bottle.type());
        model.setDistillery(bottle.distillery());
        return ResponseEntity.status(HttpStatus.OK).body(model);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/filter")
    public ResponseEntity<List<BottleResponseModel>> userBottlesFilter(Authentication authentication,
                                                                       @RequestParam(required = false) String name,
                                                                       @RequestParam(required = false) String distillery,
                                                                       @RequestParam(required = false) String producer,
                                                                       @RequestParam(required = false) BigDecimal minPrice,
                                                                       @RequestParam(required = false) BigDecimal maxPrice) {
        String userId = authentication.getName();
        List<BottleDto> filteredBottles = bottleService.filterBottles(
                userId,
                name,
                distillery,
                producer,
                minPrice,
                maxPrice
        );
        List<BottleResponseModel> returnValue = new ArrayList<>();
        if(filteredBottles == null || filteredBottles.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(returnValue);
        }
        for(BottleDto bottle : filteredBottles) {
            BottleResponseModel model = new BottleResponseModel();
            model.setId(bottle.id());
            model.setUserId(userId);
            model.setName(bottle.name());
            model.setType(bottle.type());
            model.setDistillery(bottle.distillery());
            returnValue.add(model);
        }
        return ResponseEntity.status(HttpStatus.OK).body(returnValue);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/new")
    public ResponseEntity<BottleResponseModel> bottleCreate(@RequestBody CreateBottleRequest createBottleRequest,
                                                            Authentication authentication
    ) {
        String userId = authentication.getName();
        BottleDto bottleDto = bottleMapper.fromCreateRequest(createBottleRequest);
        BottleDto createdBottle = bottleService.createBottle(userId, bottleDto);
        BottleResponseModel returnValue = modelMapper.map(createdBottle, BottleResponseModel.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(returnValue);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{bottleId}")
    public ResponseEntity<BottleResponseModel> bottleUpdate(@PathVariable String bottleId,
                                                            @RequestBody CreateBottleRequest createBottleRequest,
                                                            Authentication authentication
    ) {
        String userId = authentication.getName();
        BottleDto bottleDto = bottleMapper.fromCreateRequest(createBottleRequest);
        BottleDto updatedBottleDto = bottleService.updateBottle(userId, bottleId, bottleDto);
        if(updatedBottleDto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).body(modelMapper.map(updatedBottleDto, BottleResponseModel.class));
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{bottleId}")
    public ResponseEntity<Void> bottleDelete(@PathVariable String bottleId, Authentication authentication) {
        String userId = authentication.getName();
        if(!bottleService.deleteBottle(userId, bottleId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
