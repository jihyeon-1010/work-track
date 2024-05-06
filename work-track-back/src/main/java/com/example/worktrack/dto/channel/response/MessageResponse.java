package com.example.worktrack.dto.channel.response;

import com.example.worktrack.entity.Channel;
import com.example.worktrack.entity.Message;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class MessageResponse {

    private String id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private List<Message> messages;

    public MessageResponse(Channel channel) {
        this.id = channel.getId();
        this.title = channel.getTitle();
        this.description = channel.getDescription();
        this.createdAt = channel.getCreatedAt();
        this.messages = channel.getMessages();
    }
}
