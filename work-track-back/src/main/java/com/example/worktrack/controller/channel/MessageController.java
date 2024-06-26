package com.example.worktrack.controller.channel;

import com.example.worktrack.dto.channel.response.MessageResponse;
import com.example.worktrack.service.channel.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/message")
public class MessageController {

    private final MessageService messageService;

    // 메시지 조회
    @GetMapping("/{channelId}")
    public ResponseEntity<MessageResponse> getMessages(@PathVariable String channelId) {
        MessageResponse messageResponse = messageService.getMessages(channelId);

        return ResponseEntity.status(HttpStatus.OK).body(messageResponse);
    }

    // 이미지 업로드
    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam MultipartFile file, @RequestParam String channelId, @RequestParam String employeeId) {
        String imageUrl = messageService.uploadImage(channelId, employeeId, file);
        
        return ResponseEntity.status(HttpStatus.OK).body(imageUrl);
    }

}
