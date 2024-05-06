package com.example.worktrack.global.login.config;

import com.example.worktrack.global.login.TokenAuthenticationFilter;
import com.example.worktrack.global.login.filter.CustomJsonUsernamePasswordAuthenticationFilter;
import com.example.worktrack.global.login.handler.LoginFailureHandler;
import com.example.worktrack.global.login.handler.LoginSuccessHandler;
import com.example.worktrack.global.login.jwt.TokenProvider;
import com.example.worktrack.global.login.service.UserDetailService;
import com.example.worktrack.repository.user.RefreshTokenRepository;
import com.example.worktrack.service.user.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

@RequiredArgsConstructor
@Configuration
public class SecurityConfig {
    private final ObjectMapper objectMapper;
    private final UserDetailService userDetailService;
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserService userService;

    // 스프링 시큐리티 기능 비활성화
    @Bean
    public WebSecurityCustomizer configure() {
        return (web) -> web.ignoring()
                .requestMatchers(new AntPathRequestMatcher("/mysql-console/**"))
                .requestMatchers(new AntPathRequestMatcher("/img/**"))
                .requestMatchers(new AntPathRequestMatcher("/css/**"))
                .requestMatchers(new AntPathRequestMatcher("/js/**"))
                .requestMatchers(new AntPathRequestMatcher("/static/**"));
    }

    // 특정 HTTP 요청에 대한 웹 기반 보안 구성
    @Bean
    public SecurityFilterChain oauthFilterChain(HttpSecurity http, HandlerMappingIntrospector introspector)
            throws Exception {
        http
                .httpBasic(httpBasic -> httpBasic.disable())  // httpBasic 비활성화
                .formLogin(formLogin -> formLogin.disable())  // formLogin 비활성화
                .csrf((csrf) -> csrf.disable());  // csrf 보안 비활성화

        http
                // 헤더를 확인할 커스텀 필터 추가
                .addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        http
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http
                // 토큰 재발급, 로그인, 회원가입 URL은 인증 없이 접근 가능, 나머지 API URL은 인증 필요
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(new MvcRequestMatcher(introspector, "/signup")).permitAll()
                        .requestMatchers(new MvcRequestMatcher(introspector, "/user")).permitAll()
                        .requestMatchers(new MvcRequestMatcher(introspector, "/login")).permitAll()
//                        .requestMatchers(new MvcRequestMatcher(introspector, "/updateProfile")).hasRole("MANAGER")
//                        .anyRequest().authenticated()
                        .anyRequest().permitAll());

        http
                .addFilterAfter(customJsonUsernamePasswordAuthenticationFilter(), LogoutFilter.class);

        return http.build();
    }

    // 인증 관리자 관련 설정
    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(bCryptPasswordEncoder());
        provider.setUserDetailsService(userDetailService);
        return new ProviderManager(provider);
    }

    // 인증 관리자 관련 설정
//    @Bean
//    public DaoAuthenticationProvider daoAuthenticationProvider() {
//        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
//
//        daoAuthenticationProvider.setUserDetailsService(userDetailService); // 사용자 정보 서비스 설정
//        daoAuthenticationProvider.setPasswordEncoder(bCryptPasswordEncoder());
//
//        return daoAuthenticationProvider;
//    }

    @Bean
    public TokenAuthenticationFilter tokenAuthenticationFilter() {
        return new TokenAuthenticationFilter(tokenProvider);
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public AuthenticationSuccessHandler loginSuccessHandler() {
        return new LoginSuccessHandler(
                tokenProvider,
                refreshTokenRepository,
                userService
        );
    }

    @Bean
    public AuthenticationFailureHandler loginFailureHandler(ObjectMapper objectMapper) {
        return new LoginFailureHandler(objectMapper);
    }

    @Bean
    public CustomJsonUsernamePasswordAuthenticationFilter customJsonUsernamePasswordAuthenticationFilter() {
        CustomJsonUsernamePasswordAuthenticationFilter customJsonUsernamePasswordLoginFilter
                = new CustomJsonUsernamePasswordAuthenticationFilter(objectMapper);
        customJsonUsernamePasswordLoginFilter.setAuthenticationManager(authenticationManager());
        customJsonUsernamePasswordLoginFilter.setAuthenticationSuccessHandler(loginSuccessHandler());
        customJsonUsernamePasswordLoginFilter.setAuthenticationFailureHandler(loginFailureHandler(objectMapper));
        return customJsonUsernamePasswordLoginFilter;
    }

}
