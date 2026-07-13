package com.bourbon_nook.bottles_api.services;

import com.bourbon_nook.bottles_api.dtos.BottleDto;
import com.bourbon_nook.bottles_api.entities.BottleEntity;
import com.bourbon_nook.bottles_api.mappers.BottleMapper;
import com.bourbon_nook.bottles_api.repositories.BottleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BottleServiceImpl implements BottleService {
    private final BottleRepository bottleRepository;
    private final BottleMapper bottleMapper;

    public BottleServiceImpl(BottleRepository bottleRepository, BottleMapper bottleMapper) {
        this.bottleRepository = bottleRepository;
        this.bottleMapper = bottleMapper;
    }

    @Override
    public BottleDto getBottleByIdAndUserId(String id, String userId) {
        return bottleRepository.findByIdAndUserId(id, userId)
                .map(bottleMapper::toDto)
                .orElse(null);
    }

    @Override
    public List<BottleDto> getUserBottles(String userId) {
        return bottleRepository.findAllByUserId(userId).stream()
                .map(bottleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BottleDto> filterBottles(String userId,
                                         String name,
                                         String distillery,
                                         String producer,
                                         BigDecimal minPrice,
                                         BigDecimal maxPrice
    ) {
        List<BottleEntity> filteredBottles = bottleRepository.findWithFilters(userId, name, distillery, producer, minPrice, maxPrice);
        return filteredBottles.stream()
                .map(bottleMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BottleDto createBottle(String userId, BottleDto bottleDto) {
        BottleEntity bottle = bottleMapper.toEntity(bottleDto);
        bottle.setUserId(userId);
        BottleEntity savedBottle = bottleRepository.save(bottle);
        return bottleMapper.toDto(savedBottle);
    }

    @Transactional
    @Override
    public BottleDto updateBottle(String userId, String id, BottleDto bottleDto) {
        BottleEntity existingBottle = bottleRepository
                .findByIdAndUserId(id, userId)
                .orElse(null);

        if(existingBottle == null) {
            return null;
        }
        existingBottle.setName(bottleDto.name());
        existingBottle.setType(bottleDto.type());
        existingBottle.setStatus(bottleDto.status());
        existingBottle.setDistillery(bottleDto.distillery());
        existingBottle.setProducer(bottleDto.producer());
        existingBottle.setCountry(bottleDto.country());
        existingBottle.setRegion(bottleDto.region());
        existingBottle.setPrice(bottleDto.price());
        existingBottle.setAge(bottleDto.age());
        existingBottle.setProof(bottleDto.proof());
        existingBottle.setReleaseYear(bottleDto.releaseYear());
        existingBottle.setBarrelInformation(bottleDto.barrelInformation());
        existingBottle.setFinishing(bottleDto.finishing());
        existingBottle.setImageUrl(bottleDto.imageUrl());
        existingBottle.setOpenDate(bottleDto.openDate());
        existingBottle.setKillDate(bottleDto.killDate());

        return bottleMapper.toDto(existingBottle);
    }

    @Override
    @Transactional
    public boolean deleteBottle(String userId, String id) {
        BottleEntity bottleToDelete = bottleRepository.findByIdAndUserId(id, userId).orElse(null);
        if(bottleToDelete == null) return false;
        bottleRepository.delete(bottleToDelete);
        return true;
    }
}
