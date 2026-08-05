package com.bourbon_nook.bottles_api.mappers;

import com.bourbon_nook.bottles_api.dtos.BottleDto;
import com.bourbon_nook.bottles_api.entities.BottleEntity;
import com.bourbon_nook.bottles_api.models.requests.CreateBottleRequest;
import com.bourbon_nook.bottles_api.models.responses.BottleResponseModel;
import org.modelmapper.ModelMapper;
import org.modelmapper.config.Configuration;
import org.springframework.stereotype.Component;

@Component
public class BottleMapper {
    private final ModelMapper modelMapper;

    public BottleMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        // BottleDto is a record, whose accessors (e.g. id()) don't match ModelMapper's
        // default JavaBean getter convention, so its properties would otherwise map as null.
        this.modelMapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(Configuration.AccessLevel.PRIVATE);
    }

    public BottleDto fromCreateRequest(CreateBottleRequest request) {
        if(request == null) return null;

        return new BottleDto(
                null,
                null,
                request.getName(),
                request.getType(),
                request.getStatus(),
                request.getDistillery(),
                request.getProducer(),
                request.getCountry(),
                request.getRegion(),
                request.getPrice(),
                request.getAge(),
                request.getProof(),
                request.getReleaseYear(),
                request.getBarrelInformation(),
                request.getFinishing(),
                request.getImageUrl(),
                request.getOpenDate(),
                request.getKillDate()
        );
    }

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

    public BottleResponseModel toResponseModel(BottleDto dto) {
        if(dto == null) return null;

        return modelMapper.map(dto, BottleResponseModel.class);
    }
}
