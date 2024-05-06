package com.example.worktrack.repository;

import com.example.worktrack.entity.Channel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChannelRepository extends MongoRepository<Channel, String> {
}
