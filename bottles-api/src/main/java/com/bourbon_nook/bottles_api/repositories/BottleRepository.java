package com.bourbon_nook.bottles_api.repositories;

import com.bourbon_nook.bottles_api.entities.BottleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BottleRepository extends JpaRepository<BottleEntity, Long> {
}
