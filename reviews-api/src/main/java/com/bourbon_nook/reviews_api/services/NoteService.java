package com.bourbon_nook.reviews_api.services;

import com.bourbon_nook.reviews_api.dtos.NoteDto;
import com.bourbon_nook.reviews_api.entities.NoteEntity;

import java.lang.ScopedValue;
import java.util.List;

public interface NoteService {
    List<NoteDto> getCategoryNotes(String categoryId);
    NoteEntity findOrCreateNoteEntity(String categoryId, String noteName, String userId);
    NoteEntity getNoteEntityById(String id);
    void deleteNote(String id);
}
