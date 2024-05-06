package com.example.worktrack.dto.user.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCreateRequest {

    private String name;
    private String email;
    private String password;
    private String profileImg;
    private String auth;

}
