package com.bourbon_nook.reviews_api.services;

import com.bourbon_nook.reviews_api.dtos.NoteCategoryWithNotesDto;
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
import java.util.Map;
import java.util.stream.Collectors;

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
    public List<NoteDto> getAllNotes() {
        List<NoteEntity> noteEntities = noteRepository.findAll();
        List<NoteDto> noteDtos = new ArrayList<>();
        for (NoteEntity noteEntity : noteEntities) {
            noteDtos.add(noteMapper.toDto(noteEntity));
        }
        return noteDtos;
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
    public NoteDto getNoteById(String noteId) {
        NoteEntity note = noteRepository.findById(noteId).orElse(null);
        if (note == null) {
            throw new NoteNotFoundException("Note with id: " + noteId + " not found");
        }
        return noteMapper.toDto(note);
    }

    @Override
    public List<NoteCategoryWithNotesDto> getCategoriesWithSystemNotes() {
        List<NoteCategoryEntity> categories = noteCategoryRepository.findAll();
        List<NoteEntity> systemNotes = noteRepository.findBySystem(true);

        Map<String, List<NoteEntity>> notesByCategoryId = systemNotes.stream()
                .collect(Collectors.groupingBy(n -> n.getCategory().getId()));

        return categories.stream()
                .map(category -> new NoteCategoryWithNotesDto(
                        category.getId(),
                        category.getName(),
                        notesByCategoryId.getOrDefault(category.getId(), List.of())
                                .stream()
                                .map(noteMapper::toDto)
                                .toList()
                ))
                .toList();
    }

    @Override
    public void deleteNote(String id) {
        NoteEntity noteEntity = noteRepository.findById(id).orElse(null);
        if (noteEntity == null) {
            throw new NoteNotFoundException("Note with id: " + id + " not found");
        }
        noteRepository.delete(noteEntity);
    }

    // These methods are for use in other services only (ReviewService)
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
}
