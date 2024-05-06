package com.example.worktrack.dto.user.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthenticatedUserResponse {

    private String name;
    private String email;
    private String profileUrl;
    private String auth;
    private String departmentName;
    private String employeeId;

}
