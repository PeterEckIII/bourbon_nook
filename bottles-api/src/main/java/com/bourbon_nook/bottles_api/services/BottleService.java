package com.bourbon_nook.bottles_api.services;

import com.bourbon_nook.bottles_api.dtos.BottleDto;

import java.util.List;

public interface BottleService {
    BottleDto getBottleById(String id);
    List<BottleDto> getUserBottles(String userId);
}
