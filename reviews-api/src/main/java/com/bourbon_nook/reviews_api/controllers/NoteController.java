package com.bourbon_nook.reviews_api.controllers;

import com.bourbon_nook.reviews_api.dtos.NoteCategoryWithNotesDto;
import com.bourbon_nook.reviews_api.dtos.NoteDto;
import com.bourbon_nook.reviews_api.mappers.NoteMapper;
import com.bourbon_nook.reviews_api.models.responses.CategoryNoteResponseModel;
import com.bourbon_nook.reviews_api.models.responses.NoteResponseModel;
import com.bourbon_nook.reviews_api.services.NoteService;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/notes")
public class NoteController {
    private final Environment env;
    private final NoteService noteService;
    private final NoteMapper noteMapper;

    public NoteController(Environment env, NoteService noteService, NoteMapper noteMapper) {
        this.env = env;
        this.noteService = noteService;
        this.noteMapper = noteMapper;
    }

    @GetMapping("/status/healthcheck")
    public String healthcheck() { return "Notes: Working on port " + env.getProperty("local.server.port"); }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<NoteResponseModel>> allNotes() {
        List<NoteDto> notes = noteService.getAllNotes();
        List<NoteResponseModel> returnValue = new ArrayList<>();
        for (NoteDto note : notes) {
            NoteResponseModel responseModel = noteMapper.toResponseModel(note);
            returnValue.add(responseModel);
        }
        return ResponseEntity.status(HttpStatus.OK).body(returnValue);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{noteId}")
    public ResponseEntity<NoteResponseModel> note(@PathVariable String noteId) {
         NoteDto note = noteService.getNoteById(noteId);
         NoteResponseModel returnValue = noteMapper.toResponseModel(note);
         return ResponseEntity.status(HttpStatus.OK).body(returnValue);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryNoteResponseModel>> categoriesWithSystemNotes() {
        List<NoteCategoryWithNotesDto> categories = noteService.getCategoriesWithSystemNotes();
        return ResponseEntity.status(HttpStatus.OK).body(categories.stream().map(noteMapper::toResponseModel).toList());
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{categoryId}")
    public ResponseEntity<List<NoteResponseModel>> categoryNotes(@PathVariable String categoryId, Authentication authentication) {
        List<NoteDto> notesForCategory = noteService.getCategoryNotes(categoryId);

        List<NoteResponseModel> responseModels = new ArrayList<>();
        for (NoteDto noteDto : notesForCategory) {
            responseModels.add(noteMapper.toResponseModel(noteDto));
        }
        return ResponseEntity.status(HttpStatus.OK).body(responseModels);
    }
}
