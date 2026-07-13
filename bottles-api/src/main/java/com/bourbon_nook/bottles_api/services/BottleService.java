package com.bourbon_nook.bottles_api.services;

import com.bourbon_nook.bottles_api.dtos.BottleDto;

import java.math.BigDecimal;
import java.util.List;

public interface BottleService {
    BottleDto getBottleByIdAndUserId(String id, String userId);
    List<BottleDto> getUserBottles(String userId);
    BottleDto createBottle(String userId, BottleDto bottleDto);
    BottleDto updateBottle(String userId, String id, BottleDto bottleDto);
    boolean deleteBottle(String userId, String id);
    List<BottleDto> filterBottles(String userId,
                                  String name,
                                  String distillery,
                                  String producer,
                                  BigDecimal minPrice,
                                  BigDecimal maxPrice);
}
