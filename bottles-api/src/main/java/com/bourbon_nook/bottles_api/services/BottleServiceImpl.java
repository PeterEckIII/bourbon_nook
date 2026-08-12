package com.bourbon_nook.bottles_api.services;

import com.bourbon_nook.bottles_api.dtos.BottleDto;
import com.bourbon_nook.bottles_api.dtos.ImageDto;
import com.bourbon_nook.bottles_api.entities.BottleEntity;
import com.bourbon_nook.bottles_api.exceptions.BottleNotFoundException;
import com.bourbon_nook.bottles_api.exceptions.DatabaseErrorException;
import com.bourbon_nook.bottles_api.exceptions.ImageUploadException;
import com.bourbon_nook.bottles_api.mappers.BottleMapper;
import com.bourbon_nook.bottles_api.repositories.BottleRepository;
import io.awspring.cloud.s3.S3Resource;
import io.awspring.cloud.s3.S3Template;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BottleServiceImpl implements BottleService {
    private final BottleRepository bottleRepository;
    private final BottleMapper bottleMapper;
    private final S3Template s3Template;

    @Value("${s3.bucket.name}")
    private String bucketName;

    public BottleServiceImpl(BottleRepository bottleRepository, BottleMapper bottleMapper, S3Template s3Template) {
        this.bottleRepository = bottleRepository;
        this.bottleMapper = bottleMapper;
        this.s3Template = s3Template;
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
        try {
            BottleEntity bottle = bottleMapper.toEntity(bottleDto);
            bottle.setUserId(userId);
            BottleEntity savedBottle = bottleRepository.save(bottle);
            return bottleMapper.toDto(savedBottle);
        } catch(DatabaseErrorException e) {
            throw new DatabaseErrorException("Could not save bottle: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ImageDto uploadImage(String userId, String bottleId, MultipartFile file) {
        BottleEntity bottle = bottleRepository.findByIdAndUserId(bottleId, userId)
                .orElseThrow(() -> new BottleNotFoundException("Bottle with id: " + bottleId + " not found"));

        String key = bottleId + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

        try (InputStream stream = file.getInputStream()) {
            S3Resource resource = s3Template.upload(bucketName, key, stream);
            String imageUrl = resource.getURL().toString();
            bottle.setImageUrl(imageUrl);
            return new ImageDto(imageUrl, bottleId);
        } catch (IOException e) {
            throw new ImageUploadException("Image upload failed: " + e.getMessage());
        }
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
    public void deleteBottle(String userId, String id) {
        BottleEntity bottleToDelete = bottleRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new BottleNotFoundException("Bottle with id: " + id + " not found"));
        bottleRepository.delete(bottleToDelete);
    }

    @Override
    public long countBottles(String userId) {
        return bottleRepository.countBottlesByUserId(userId);
    }
}
