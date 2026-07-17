package com.bourbon_nook.reviews_api.repositories;

import com.bourbon_nook.reviews_api.entities.NoteCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NoteCategoryRepository extends JpaRepository<NoteCategoryEntity, String> {
    Optional<NoteCategoryEntity> findByName(String name);
}
