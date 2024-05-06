package com.example.worktrack.config.websocket;

import com.example.worktrack.dto.channel.request.MessageRequest;
import com.example.worktrack.dto.channel.response.MessageResponse;
import com.example.worktrack.service.channel.MessageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Component
public class CustomWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final MessageService messageService;
    private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    // 현재 연결된 세션 저장
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.put(session.getId(), session);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        String payload = message.getPayload();
        MessageRequest request = objectMapper.readValue(payload, MessageRequest.class);

        // 메시지를 DB에 저장한 후 해당 채널을 가져옴
        MessageResponse messageResponse = messageService.saveMessage(request);

        // 응답 객체를 json 문자열로 변환하여 클라이언트에 전송
        String responseMessage = objectMapper.writeValueAsString(messageResponse);
        broadcast(responseMessage);
    }

    // 연결 종료 시 세션 목록에서 제고
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session.getId());
    }

    // 현재 연결된 모든 세션에 메시지 전송
    private void broadcast(String message) {
        sessions.values().forEach(session -> {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (IOException e) {
                System.err.println("세션에 메시지 전송 실패 " + session.getId());
            }
        });
    }
}
