package com.example.worktrack.entity;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Document(collection = "messages")
public class Message {

    @Id
    private String id;
    private String text;
    private String image;
    private LocalDateTime createdAt;
    private Employee employee;

    public Message(String text, String image, Employee employee) {
        this.text = text;
        this.image = image;
        this.createdAt = LocalDateTime.now();
        this.employee = employee;
    }
}
