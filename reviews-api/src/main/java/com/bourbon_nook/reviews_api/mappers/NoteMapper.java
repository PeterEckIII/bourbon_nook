package com.bourbon_nook.reviews_api.mappers;

import com.bourbon_nook.reviews_api.dtos.NoteCategoryDto;
import com.bourbon_nook.reviews_api.dtos.NoteDto;
import com.bourbon_nook.reviews_api.entities.NoteCategoryEntity;
import com.bourbon_nook.reviews_api.entities.NoteEntity;
import org.springframework.stereotype.Component;

@Component
public class NoteMapper {
    private final NoteCategoryMapper noteCategoryMapper;

    public NoteMapper(NoteCategoryMapper noteCategoryMapper) {
        this.noteCategoryMapper = noteCategoryMapper;
    }

    public NoteDto toDto(NoteEntity noteEntity) {
        if(noteEntity == null) return null;
        NoteCategoryDto noteCategoryDto = noteCategoryMapper.toDto(noteEntity.getCategory());

        return new NoteDto(
                noteEntity.getId(),
                noteCategoryDto,
                noteEntity.getName(),
                noteEntity.isSystem(),
                noteEntity.getCreatedBy()
        );
    }

    public NoteEntity toEntity(NoteDto noteDto) {
        if(noteDto == null) return null;

        NoteCategoryEntity category = noteCategoryMapper.toEntity(noteDto.category());

        return noteDto.createdBy() != null
                ? NoteEntity.userNote(category, noteDto.name(), noteDto.createdBy())
                : NoteEntity.systemNote(category, noteDto.name());
    }
}
