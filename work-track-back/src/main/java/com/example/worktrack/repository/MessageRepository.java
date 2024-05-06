package com.example.worktrack.repository;

import com.example.worktrack.entity.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MessageRepository extends MongoRepository<Message, String> {
}
