package com.example.worktrack.config.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorMessage> handleIllegalArgumentException(IllegalArgumentException ex) {
        ErrorMessage errorMessage = new ErrorMessage(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorMessage> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        ErrorMessage errorMessage = new ErrorMessage(HttpStatus.NOT_FOUND.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
    }

    // 예외 메시지를 포함하는 클래스 정의
    @Getter
    public static class ErrorMessage {
        private final int statusCode;
        private final String message;

        public ErrorMessage(int statusCode, String message) {
            this.statusCode = statusCode;
            this.message = message;
        }
    }
}
