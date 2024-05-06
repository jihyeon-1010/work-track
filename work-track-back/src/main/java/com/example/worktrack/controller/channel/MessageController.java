package com.example.worktrack.controller.channel;

import com.example.worktrack.dto.channel.response.MessageResponse;
import com.example.worktrack.service.channel.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
public class MessageController {

    private final MessageService messageService;

    // 메시지 조회
    @GetMapping("message/{channelId}")
    public ResponseEntity<MessageResponse> getMessages(@PathVariable String channelId) {
        MessageResponse messageResponse = messageService.getMessages(channelId);

        return ResponseEntity.status(HttpStatus.OK).body(messageResponse);
    }

}
