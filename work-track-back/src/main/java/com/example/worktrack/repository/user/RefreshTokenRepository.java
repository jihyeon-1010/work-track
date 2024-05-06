package com.example.worktrack.repository.user;

import com.example.worktrack.entity.RefreshToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends MongoRepository<RefreshToken, String> {

    // 사용자 id에 해당하는 리프레시 토큰 반환
    Optional<RefreshToken> findByUserId(String userId);

    // 주어진 리프레시 토큰에 해당하는 리프레시 토큰 반환
    Optional<RefreshToken> findByRefreshToken(String refreshToken);

}
