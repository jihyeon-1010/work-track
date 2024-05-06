package com.example.worktrack.dto.user.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserResponse {

    private String id;
    private String name;
    private String email;
    private String profileUrl;

}
