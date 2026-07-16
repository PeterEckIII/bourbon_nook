package com.bourbon_nook.reviews_api.services;

import com.bourbon_nook.reviews_api.dtos.NoteDto;
import com.bourbon_nook.reviews_api.entities.NoteCategoryEntity;
import com.bourbon_nook.reviews_api.entities.NoteEntity;
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
            return null;
        }

        List<NoteDto> notes = new ArrayList<>();
        List<NoteEntity> noteEntities = noteRepository.findByCategory(noteCategory);
        for (NoteEntity note : noteEntities) {
            notes.add(noteMapper.toDto(note));
        }
        return notes;
    }

    @Override
    public NoteDto getNoteById(String id) {
        return noteMapper.toDto(noteRepository.findById(id).orElse(null));
    }

    @Override
    public NoteDto createNote(NoteDto noteDto) {
        NoteEntity noteEntity = noteMapper.toEntity(noteDto);
        noteRepository.save(noteEntity);
        return noteMapper.toDto(noteEntity);
    }

    @Override
    public boolean deleteNote(String id) {
        NoteEntity noteEntity = noteRepository.findById(id).orElse(null);
        if (noteEntity == null) return false;
        noteRepository.delete(noteEntity);
        return true;
    }
}
