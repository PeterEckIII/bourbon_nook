package com.bourbon_nook.reviews_api.mappers;

import com.bourbon_nook.reviews_api.dtos.NoteCategoryDto;
import com.bourbon_nook.reviews_api.entities.NoteCategoryEntity;
import org.springframework.stereotype.Component;

@Component
public class NoteCategoryMapper {
    public NoteCategoryDto toDto(NoteCategoryEntity noteCategoryEntity) {
        if(noteCategoryEntity == null) return null;

        return new NoteCategoryDto(
                noteCategoryEntity.getId(),
                noteCategoryEntity.getName()
        );
    }

    public NoteCategoryEntity toEntity(NoteCategoryDto noteCategoryDto) {
        if(noteCategoryDto == null) return null;

        return new NoteCategoryEntity(noteCategoryDto.name());
    }
}
