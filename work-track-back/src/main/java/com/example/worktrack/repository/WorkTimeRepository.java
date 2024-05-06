package com.example.worktrack.repository;

import com.example.worktrack.entity.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface WorkTimeRepository extends MongoRepository<Attendance, String> {
    Optional<Attendance> findByEmployeeId(String employeeId);

    Optional<Attendance> findByDateAndEmployeeId(
            LocalDate date,
            String employeeId);

}
