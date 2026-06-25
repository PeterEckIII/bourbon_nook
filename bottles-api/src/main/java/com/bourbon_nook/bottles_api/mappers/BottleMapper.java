package com.bourbon_nook.bottles_api.mappers;

import com.bourbon_nook.bottles_api.dtos.BottleDto;
import com.bourbon_nook.bottles_api.entities.BottleEntity;
import org.springframework.stereotype.Component;

@Component
public class BottleMapper {
    public BottleDto toDto(BottleEntity entity) {
        if(entity == null) return null;

        return new BottleDto(
                entity.getId(),
                entity.getUserId(),
                entity.getName(),
                entity.getType(),
                entity.getStatus(),
                entity.getDistillery(),
                entity.getProducer(),
                entity.getCountry(),
                entity.getRegion(),
                entity.getPrice(),
                entity.getAge(),
                entity.getProof(),
                entity.getYear(),
                entity.getBarrelInformation(),
                entity.getFinishing(),
                entity.getImageUrl(),
                entity.getOpenDate(),
                entity.getKillDate()
        );
    }

    public BottleEntity toEntity(BottleDto dto) {
        if(dto == null) return null;

        BottleEntity entity = new BottleEntity();

        entity.setName(dto.name());
        entity.setType(dto.type());
        entity.setStatus(dto.status());
        entity.setDistillery(dto.distillery());
        entity.setProducer(dto.producer());
        entity.setCountry(dto.country());
        entity.setRegion(dto.region());
        entity.setPrice(dto.price());
        entity.setAge(dto.age());
        entity.setProof(dto.proof());
        entity.setReleaseYear(dto.releaseYear());
        entity.setBarrelInformation(dto.barrelInformation());
        entity.setFinishing(dto.finishing());
        entity.setImageUrl(dto.imageUrl());
        entity.setOpenDate(dto.openDate());
        entity.setKillDate(dto.killDate());

        return entity;

    }
}
