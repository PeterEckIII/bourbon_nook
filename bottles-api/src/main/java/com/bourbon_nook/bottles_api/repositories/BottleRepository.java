package com.bourbon_nook.bottles_api.repositories;

import com.bourbon_nook.bottles_api.entities.BottleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BottleRepository extends JpaRepository<BottleEntity, String> {
    List<BottleEntity> findAllByUserId(String userId);
    Optional<BottleEntity> findByIdAndUserId(String id, String userId);
}
