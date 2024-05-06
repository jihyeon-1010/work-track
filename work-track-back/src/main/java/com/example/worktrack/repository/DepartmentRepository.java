package com.example.worktrack.repository;

import com.example.worktrack.entity.Department;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DepartmentRepository extends MongoRepository<Department, String> {
}
