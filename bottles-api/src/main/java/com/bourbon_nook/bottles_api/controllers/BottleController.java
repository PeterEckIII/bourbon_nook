package com.bourbon_nook.bottles_api.controllers;

import com.bourbon_nook.bottles_api.dtos.BottleDto;
import com.bourbon_nook.bottles_api.dtos.ImageDto;
import com.bourbon_nook.bottles_api.mappers.BottleMapper;
import com.bourbon_nook.bottles_api.models.requests.CreateBottleRequest;
import com.bourbon_nook.bottles_api.models.responses.BottleResponseModel;
import com.bourbon_nook.bottles_api.models.responses.ImageResponseModel;
import com.bourbon_nook.bottles_api.services.BottleService;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/bottles")
public class BottleController {
    private final ModelMapper modelMapper;
    Logger logger = LoggerFactory.getLogger(BottleController.class);

    private final Environment env;
    private final BottleService bottleService;
    private final BottleMapper bottleMapper;

    public BottleController(Environment env, BottleService bottleService, BottleMapper bottleMapper, ModelMapper modelMapper) {
        this.env = env;
        this.bottleService = bottleService;
        this.bottleMapper = bottleMapper;
        this.modelMapper = modelMapper;
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
            return ResponseEntity.status(HttpStatus.OK).body(returnValue);
        }

        for (BottleDto bottle : bottles) {
            returnValue.add(bottleMapper.toResponseModel(bottle));
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
        return ResponseEntity.status(HttpStatus.OK).body(bottleMapper.toResponseModel(bottle));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/count")
    public ResponseEntity<Long> countBottles(Authentication authentication) {
        String userId = authentication.getName();
        Long bottleCount = bottleService.countBottles(userId);
        return ResponseEntity.status(HttpStatus.OK).body(bottleCount);
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
            returnValue.add(bottleMapper.toResponseModel(bottle));
        }
        return ResponseEntity.status(HttpStatus.OK).body(returnValue);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/new")
    public ResponseEntity<BottleResponseModel> bottleCreate(@Valid @RequestBody CreateBottleRequest createBottleRequest,
                                                            Authentication authentication
    ) {
        String userId = authentication.getName();
        BottleDto bottleDto = bottleMapper.fromCreateRequest(createBottleRequest);
        BottleDto createdBottle = bottleService.createBottle(userId, bottleDto);
        BottleResponseModel returnValue = bottleMapper.toResponseModel(createdBottle);
        return ResponseEntity.status(HttpStatus.CREATED).body(returnValue);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping(path="/{bottleId}/image", consumes="multipart/form-data")
    public ResponseEntity<ImageResponseModel> imageCreate(@PathVariable String bottleId,
                                                          @RequestParam("file") MultipartFile file,
                                                          Authentication authentication
    ) {
        String userId = authentication.getName();
        ImageDto image = bottleService.uploadImage(userId, bottleId, file);
        ImageResponseModel imageResponse = modelMapper.map(image, ImageResponseModel.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(imageResponse);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{bottleId}")
    public ResponseEntity<BottleResponseModel> bottleUpdate(@PathVariable String bottleId,
                                                            @Valid @RequestBody CreateBottleRequest createBottleRequest,
                                                            Authentication authentication
    ) {
        String userId = authentication.getName();
        BottleDto bottleDto = bottleMapper.fromCreateRequest(createBottleRequest);
        BottleDto updatedBottleDto = bottleService.updateBottle(userId, bottleId, bottleDto);
        if(updatedBottleDto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.status(HttpStatus.OK).body(bottleMapper.toResponseModel(updatedBottleDto));
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{bottleId}")
    public ResponseEntity<Void> bottleDelete(@PathVariable String bottleId, Authentication authentication) {
        String userId = authentication.getName();
        bottleService.deleteBottle(userId, bottleId);
        return ResponseEntity.noContent().build();
    }
}
