package com.example.worktrack.repository;

import com.example.worktrack.entity.Annual;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;

public interface AnnualLeaveRepository extends MongoRepository<Annual, String> {
    int countByEmployeeIdAndAnnualLeaveDateBetween(String employeeId, LocalDate startOfYear, LocalDate endOfYear);

    Annual findByAnnualLeaveDateAndEmployeeId(LocalDate currentDate, String employeeId);
}
