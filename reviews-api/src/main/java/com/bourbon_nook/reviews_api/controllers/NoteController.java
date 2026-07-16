package com.bourbon_nook.reviews_api.controllers;

import com.bourbon_nook.reviews_api.models.responses.NoteResponseModel;
import com.bourbon_nook.reviews_api.services.NoteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notes")
public class NoteController {
    Logger logger = LoggerFactory.getLogger(NoteController.class);

    private final Environment env;
    private final NoteService noteService;

    public NoteController(Environment env, NoteService noteService) {
        this.env = env;
        this.noteService = noteService;
    }

    @GetMapping("/status/healthcheck")
    public String healthcheck() { return "Notes: Working on port " + env.getProperty("local.server.port"); }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{reviewId}")
    public ResponseEntity<List<NoteResponseModel>> reviewNotes(@PathVariable String reviewId, Authentication authentication) {

    }
}
