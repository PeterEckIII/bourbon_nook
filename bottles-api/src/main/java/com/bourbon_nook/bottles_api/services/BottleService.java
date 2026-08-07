package com.bourbon_nook.bottles_api.services;

import com.bourbon_nook.bottles_api.dtos.BottleDto;
import com.bourbon_nook.bottles_api.dtos.ImageDto;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface BottleService {
    BottleDto getBottleByIdAndUserId(String id, String userId);
    List<BottleDto> getUserBottles(String userId);
    BottleDto createBottle(String userId, BottleDto bottleDto);
    ImageDto uploadImage(String userId, String bottleId, MultipartFile file);
    BottleDto updateBottle(String userId, String id, BottleDto bottleDto);
    void deleteBottle(String userId, String id);
    long countBottles(String userId);
    List<BottleDto> filterBottles(String userId,
                                  String name,
                                  String distillery,
                                  String producer,
                                  BigDecimal minPrice,
                                  BigDecimal maxPrice);
}
