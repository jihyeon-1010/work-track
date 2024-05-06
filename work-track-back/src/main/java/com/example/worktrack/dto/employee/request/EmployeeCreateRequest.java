package com.example.worktrack.dto.employee.request;

import com.example.worktrack.entity.Employee;
import com.example.worktrack.entity.User;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class EmployeeCreateRequest {

    private String userId;
    private String departmentId;
    private LocalDate workStartDate;
    private LocalDate birthday;

    public Employee toEntity(User user, String departmentId, LocalDate birthday, LocalDate workStartDate) {
        return new Employee(user, departmentId, birthday, workStartDate);
    }

}
