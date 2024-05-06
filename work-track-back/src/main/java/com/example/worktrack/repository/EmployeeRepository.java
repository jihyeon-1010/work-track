package com.example.worktrack.repository;

import com.example.worktrack.entity.Annual;
import com.example.worktrack.entity.Employee;
import com.example.worktrack.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends MongoRepository<Employee, String> {
    Optional<Employee> findByUser(User user);

    List<Employee> findAllByUser_NameContaining(String query);

}
