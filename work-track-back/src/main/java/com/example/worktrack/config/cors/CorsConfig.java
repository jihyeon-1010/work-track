package com.example.worktrack.config.cors;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 요청에 대해 CORS 활성화
                .allowedOrigins("*") // 모든 도메인에서 요청 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE") // 허용할 HTTP 메서드 지정
                .allowedHeaders("*"); // 요청 헤더 허용
    }
}
