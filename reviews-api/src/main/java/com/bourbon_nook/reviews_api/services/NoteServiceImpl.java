package com.bourbon_nook.reviews_api.services;

import com.bourbon_nook.reviews_api.dtos.NoteDto;
import com.bourbon_nook.reviews_api.entities.NoteCategoryEntity;
import com.bourbon_nook.reviews_api.entities.NoteEntity;
import com.bourbon_nook.reviews_api.exceptions.NoteCategoryNotFoundException;
import com.bourbon_nook.reviews_api.exceptions.NoteNotFoundException;
import com.bourbon_nook.reviews_api.mappers.NoteMapper;
import com.bourbon_nook.reviews_api.repositories.NoteCategoryRepository;
import com.bourbon_nook.reviews_api.repositories.NoteRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NoteServiceImpl implements NoteService {
    private final NoteRepository noteRepository;
    private final NoteCategoryRepository noteCategoryRepository;
    private final NoteMapper noteMapper;

    public NoteServiceImpl(NoteRepository noteRepository,
                           NoteCategoryRepository noteCategoryRepository,
                           NoteMapper noteMapper
    ) {
        this.noteRepository = noteRepository;
        this.noteCategoryRepository = noteCategoryRepository;
        this.noteMapper = noteMapper;
    }

    @Override
    public List<NoteDto> getCategoryNotes(String categoryId) {
        NoteCategoryEntity noteCategory = noteCategoryRepository.findById(categoryId).orElse(null);
        if (noteCategory == null) {
            throw new NoteCategoryNotFoundException("Category with id: " + categoryId + " not found");
        }

        List<NoteDto> notes = new ArrayList<>();
        List<NoteEntity> noteEntities = noteRepository.findByCategory(noteCategory);
        for (NoteEntity note : noteEntities) {
            notes.add(noteMapper.toDto(note));
        }
        return notes;
    }

    @Override
    public NoteEntity findOrCreateNoteEntity(String categoryId, String noteName, String userId) {
        NoteCategoryEntity category = noteCategoryRepository.findById(categoryId).orElse(null);
        if (category == null) {
            throw new NoteCategoryNotFoundException("Category with ID " + categoryId + " does not exist");
        }

        return noteRepository
                .findByCategoryAndNameAndCreatedBy(category, noteName, userId)
                .orElseGet(() -> noteRepository.save(NoteEntity.userNote(category, noteName, userId)));
    }

    @Override
    public NoteEntity getNoteEntityById(String id) {
        return noteRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteNote(String id) {
        NoteEntity noteEntity = noteRepository.findById(id).orElse(null);
        if (noteEntity == null) {
            throw new NoteNotFoundException("Note with id: " + id + " not found");
        }
        noteRepository.delete(noteEntity);
    }
}
