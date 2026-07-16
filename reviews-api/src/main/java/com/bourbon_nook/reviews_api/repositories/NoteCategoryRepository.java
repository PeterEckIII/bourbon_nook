package com.bourbon_nook.reviews_api.repositories;

import com.bourbon_nook.reviews_api.dtos.NoteCategoryDto;
import com.bourbon_nook.reviews_api.entities.NoteCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoteCategoryRepository extends JpaRepository<NoteCategoryEntity, String> {
    NoteCategoryDto findByName(String name);
}
