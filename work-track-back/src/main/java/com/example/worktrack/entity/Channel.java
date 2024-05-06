package com.example.worktrack.entity;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Document(collection = "channels")
public class Channel {

    @Id
    private String id;

    private String title;

    private String description;

    private LocalDateTime createdAt;

    private List<Message> messages = new ArrayList<>();

    public Channel(String title, String description) {
        this.title = title;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }

    public void addMessage(Message message) {
        this.messages.add(message);
    }
}
