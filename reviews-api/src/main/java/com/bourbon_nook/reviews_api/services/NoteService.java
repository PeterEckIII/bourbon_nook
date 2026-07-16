package com.bourbon_nook.reviews_api.services;

import com.bourbon_nook.reviews_api.dtos.NoteDto;
import com.bourbon_nook.reviews_api.entities.NoteEntity;

import java.util.List;

public interface NoteService {
    List<NoteDto> getCategoryNotes(String categoryId);
    NoteDto getNoteById(String id);
    NoteEntity findOrCreateNote(String categoryId, String noteName, String userId);
    NoteDto createNote(NoteDto noteDto);
    boolean deleteNote(String id);
}
