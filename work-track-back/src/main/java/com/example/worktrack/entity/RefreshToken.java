package com.example.worktrack.entity;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Document(collection = "refresh_token")
public class RefreshToken {

    @Id
    private String id;

    private String userId;

    private String refreshToken;

    public RefreshToken(String userId, String refreshToken) {
        this.userId = userId;
        this.refreshToken = refreshToken;
    }

    public RefreshToken update(String newRefreshToken) {
        this.refreshToken = newRefreshToken;
        return this;
    }

}
