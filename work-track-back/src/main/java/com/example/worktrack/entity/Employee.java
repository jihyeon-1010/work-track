package com.example.worktrack.entity;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Getter
@Document(collection = "employee")
public class Employee {

    @Id
    private String id;

    private String departmentId;

    private User user;

    private LocalDate birthday;

    private LocalDate workStartDate;

    public Employee(User user, String departmentId, LocalDate birthday, LocalDate workStartDate) {
        this.user = user;
        this.departmentId = departmentId;
        this.birthday = birthday;
        this.workStartDate = workStartDate;
    }

}
