package com.bourbon_nook.users_api.dtos;

import com.bourbon_nook.users_api.entities.UserEntity;

public record UserSummaryDto(Long id, String username) {
    public static UserSummaryDto from(UserEntity user) {
        return new UserSummaryDto(user.getId(), user.getUsername());
    }
}
