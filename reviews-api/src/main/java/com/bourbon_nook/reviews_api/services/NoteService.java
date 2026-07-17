package com.bourbon_nook.reviews_api.services;

import com.bourbon_nook.reviews_api.dtos.NoteCategoryWithNotesDto;
import com.bourbon_nook.reviews_api.dtos.NoteDto;
import com.bourbon_nook.reviews_api.entities.NoteEntity;

import java.util.List;

public interface NoteService {
    // These methods are to be used in the NoteController
    List<NoteDto> getAllNotes();
    List<NoteDto> getCategoryNotes(String categoryId);
    NoteDto getNoteById(String noteId);
    List<NoteCategoryWithNotesDto> getCategoriesWithSystemNotes();

    // return NoteEntity only in other services (ReviewService)
    NoteEntity findOrCreateNoteEntity(String categoryId, String noteName, String userId);
    NoteEntity getNoteEntityById(String id);

    void deleteNote(String id);
}
