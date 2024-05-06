package com.example.worktrack.entity;

import com.example.worktrack.global.login.Role;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String profileUrl;

    private Role auth;

    public User(String name, String email, String password, String profileUrl, Role auth) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.profileUrl = profileUrl;
        this.auth = auth;
    }

    public User updateProfile(String profileUrl) {
        this.profileUrl = profileUrl;

        return this;
    }

}

