package com.example.worktrack.repository.user;

import com.example.worktrack.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    List<User> findAllByNameContaining(String name);
}
