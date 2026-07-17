package com.bourbon_nook.reviews_api.repositories;

import com.bourbon_nook.reviews_api.entities.NoteCategoryEntity;
import com.bourbon_nook.reviews_api.entities.NoteEntity;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<NoteEntity, String> {
    List<NoteEntity> findByCategory(@NotNull NoteCategoryEntity category);
    List<NoteEntity> findBySystem(boolean system);
    Optional<NoteEntity> findByCategoryAndNameAndCreatedBy(NoteCategoryEntity category, String name, String createdBy);
}
