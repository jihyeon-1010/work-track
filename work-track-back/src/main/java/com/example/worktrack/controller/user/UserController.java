package com.example.worktrack.controller.user;

import com.example.worktrack.dto.user.request.UserCreateRequest;
import com.example.worktrack.dto.user.request.UserUpdateRequest;
import com.example.worktrack.dto.user.response.AuthenticatedUserResponse;
import com.example.worktrack.dto.user.response.UserResponse;
import com.example.worktrack.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class UserController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/user")
    public void signup(@RequestBody UserCreateRequest request) {
        userService.signup(request);
    }

    // 로그아웃
    @PostMapping("/customLogout")
    public void logout() {
        SecurityContextHolder.clearContext();
    }

    // 인증된 사용자 정보 반환
    @GetMapping("/authenticate")
    public ResponseEntity<AuthenticatedUserResponse> authenticate(Principal principal) {
        AuthenticatedUserResponse authenticatedUser = userService.getAuthentication(principal);

        return ResponseEntity.status(HttpStatus.OK).body(authenticatedUser);
    }

    // 검색 조회
    @GetMapping("/user")
    public ResponseEntity<List<UserResponse>> getSearchUser(@RequestParam String query) {
        List<UserResponse> user = userService.getSearchUser(query);

        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    // 프로필 사진 업데이트
    @PutMapping("/updateProfile")
    public ResponseEntity<AuthenticatedUserResponse> updateProfile (@RequestBody UserUpdateRequest request, Principal principal) {
        AuthenticatedUserResponse authenticatedUserResponse = userService.updateProfile(request, principal);

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noCache())
                .body(authenticatedUserResponse);
    }
}
