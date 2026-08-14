package com.bourbon_nook.bottles_api.dtos;

import com.bourbon_nook.bottles_api.enums.BottleStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record BottleDto(
     String id,
     String userId,
     LocalDateTime createdAt,
     String name,
     String type,
     BottleStatus status,
     String distillery,
     String producer,
     String country,
     String region,
     BigDecimal price,
     String age,
     double proof,
     int releaseYear,
     String barrelInformation,
     String finishing,
     String imageUrl,
     LocalDate openDate,
     LocalDate killDate
) {}
