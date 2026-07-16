package com.bourbon_nook.reviews_api.repositories;

import com.bourbon_nook.reviews_api.entities.NoteCategoryEntity;
import com.bourbon_nook.reviews_api.entities.NoteEntity;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<NoteEntity, String> {
    List<NoteEntity> findByCategory(@NotNull NoteCategoryEntity category);
    NoteEntity createNote(NoteEntity note);
}
