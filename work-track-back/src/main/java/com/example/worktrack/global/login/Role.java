package com.example.worktrack.global.login;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {

    EMPLOYEE("ROLE_EMPLOYEE"), MANAGER("ROLE_MANAGER");
    private final String key;

}
