package com.bourbon_nook.reviews_api.dtos;

import java.util.List;

public record NoteCategoryWithNotesDto (
        String id,
        String name,
        List<NoteDto> systemNotes
) {
}
