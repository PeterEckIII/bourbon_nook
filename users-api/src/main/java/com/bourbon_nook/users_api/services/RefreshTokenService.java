package com.bourbon_nook.users_api.services;

import java.time.Duration;
import java.util.Optional;

public interface RefreshTokenService {
    String issue(String userId, Duration validFor);
    Optional<String> validateAndGetUserId(String tokenId);
    void revoke(String tokenId);
    void revokeAllForUser(String userId);
}
