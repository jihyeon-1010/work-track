package com.example.worktrack.dto.employee.response;

import com.example.worktrack.entity.Employee;
import com.example.worktrack.entity.User;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class EmployeeResponse {

    private String id;
    private User user;

    public EmployeeResponse(Employee employee) {
        this.id = employee.getId();
        this.user = employee.getUser();
    }
}
