package com.example.worktrack.global.login.handler;

import com.example.worktrack.entity.RefreshToken;
import com.example.worktrack.entity.User;
import com.example.worktrack.global.login.jwt.TokenProvider;
import com.example.worktrack.repository.user.RefreshTokenRepository;
import com.example.worktrack.service.user.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
public class LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    public static final Duration REFRESH_TOKEN_DURATION = Duration.ofDays(14); // 리프레시 토큰 유효기간 (2주)
    public static final Duration ACCESS_TOKEN_DURATION = Duration.ofDays(1); // 액세스 토큰의 유효 기간(1일)

    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserService userService;

    // 사용자가 성공적으로 인증될 때 호출
    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {
//        response.setStatus(HttpServletResponse.SC_OK);

        // 인증 정보에서 email 추출
        String email = extractUsername(authentication);

        User user = userService.findByEmail(email);

        // ---------------- 리프레시 토큰 ----------------
        // 토큰 제공자를 사용해 리프레시 토큰 생성
        String refreshToken = tokenProvider.generateToken(user, REFRESH_TOKEN_DURATION);
        // 해당 리프레시 토큰을 유저 ID와 함께 DB에 저장
        saveRefreshToken(user.getId(), refreshToken);

        // ---------------- 액세스 토큰 ----------------
        // 토큰 제공자를 사용해 액세스 토큰 생성
        String accessToken = tokenProvider.generateToken(user, ACCESS_TOKEN_DURATION);

        // ---------------- 응답 ----------------
        // 응답 데이터 생성
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("accessToken", accessToken);
        responseData.put("refreshToken", refreshToken);

        // 응답의 Content-Type 및 상태코드 설정
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);

        // 응답 데이터를 JSON 형식으로 변환하여 클라이언트로 전송
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(response.getWriter(), responseData);
    }

    // 현재 인증된 사용자 이메일 반환
    private String extractUsername(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userDetails.getUsername();
    }

    // 유저 id와 생성된 리프레시 토큰을 전달받아 DB에 저장
    private void saveRefreshToken(String userId, String newRefreshToken) {
        RefreshToken refreshToken = refreshTokenRepository.findByUserId(userId)
                .map(entity -> entity.update(newRefreshToken))
                .orElse(new RefreshToken(userId, newRefreshToken));

        refreshTokenRepository.save(refreshToken);

        log.info("리프레시 토큰이 저장되었습니다. RefreshToken : {}", refreshToken);
    }

}
