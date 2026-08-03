package com.bourbon_nook.users_api.services;

import com.bourbon_nook.users_api.entities.RefreshTokenEntity;
import com.bourbon_nook.users_api.repositories.RefreshTokenRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenServiceImpl(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Override
    public String issue(String userId, Duration validFor) {
        String tokenId = UUID.randomUUID().toString();
        RefreshTokenEntity entity = new RefreshTokenEntity(
            tokenId,
            userId,
            Instant.now().plus(validFor)
        );
        refreshTokenRepository.save(entity);
        return tokenId;
    }

    @Override
    public Optional<String> validateAndGetUserId(String tokenId) {
        return refreshTokenRepository.findByIdAndRevokedFalse(tokenId)
                .filter(token -> token.getExpiresAt().isAfter(Instant.now()))
                .map(RefreshTokenEntity::getUserId);
    }

    @Override
    public void revoke(String tokenId) {
        refreshTokenRepository.findByIdAndRevokedFalse(tokenId)
                .ifPresent(token -> {
                    token.setRevoked(true);
                    refreshTokenRepository.save(token);
                });
    }

    @Override
    public void revokeAllForUser(String userId) {
        refreshTokenRepository.revokeAllForUser(userId);
    }
}
