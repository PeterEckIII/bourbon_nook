package com.bourbon_nook.bottles_api.services;

import com.bourbon_nook.bottles_api.dtos.BottleDto;
import com.bourbon_nook.bottles_api.entities.BottleEntity;
import com.bourbon_nook.bottles_api.repositories.BottleRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BottleServiceImpl implements BottleService {
    private final BottleRepository bottleRepository;

    public BottleServiceImpl(BottleRepository bottleRepository) {
        this.bottleRepository = bottleRepository;
    }

    @Override
    public BottleDto getBottleById(String id) {
        BottleEntity bottle = bottleRepository.findById(id).orElseThrow();
        return new BottleDto(
                bottle.getId(),
                bottle.getUserId(),
                bottle.getName(),
                bottle.getType(),
                bottle.getStatus(),
                bottle.getDistillery(),
                bottle.getProducer(),
                bottle.getCountry(),
                bottle.getRegion(),
                bottle.getPrice(),
                bottle.getAge(),
                bottle.getProof(),
                bottle.getYear(),
                bottle.getBarrelInformation(),
                bottle.getFinishing(),
                bottle.getImageUrl(),
                bottle.getOpenDate(),
                bottle.getKillDate()
        );
    }

    @Override
    public List<BottleDto> getUserBottles(String userId) {
        List<BottleEntity> bottles = bottleRepository.findAllByUserId(userId);
        List<BottleDto> bottleDtos = new ArrayList<>();
        for (BottleEntity bottle : bottles) {
            bottleDtos.add(new BottleDto(
                    bottle.getId(),
                    bottle.getUserId(),
                    bottle.getName(),
                    bottle.getType(),
                    bottle.getStatus(),
                    bottle.getDistillery(),
                    bottle.getProducer(),
                    bottle.getCountry(),
                    bottle.getRegion(),
                    bottle.getPrice(),
                    bottle.getAge(),
                    bottle.getProof(),
                    bottle.getYear(),
                    bottle.getBarrelInformation(),
                    bottle.getFinishing(),
                    bottle.getImageUrl(),
                    bottle.getOpenDate(),
                    bottle.getKillDate()
            ));
        }
        return bottleDtos;
    }
}
