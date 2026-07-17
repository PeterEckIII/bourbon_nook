package com.bourbon_nook.reviews_api.dtos;

import java.time.LocalDate;
import java.util.List;

public record ReviewDto (
        String id,
        String bottleId,
        String userId,
        String setting,
        LocalDate reviewDate,
        Integer restTimeMin,
        String glassware,
        String nose,
        String palate,
        String finish,
        String thoughts,
        Integer valueScore,
        Integer overallRating,
        List<ReviewNoteDto> reviewNotes
) {}
