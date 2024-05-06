package com.example.worktrack.entity;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Getter
@Document(collection = "annual")
public class Annual {

    @Id
    private String id;

    private String employeeId;

    private LocalDate annualLeaveDate;

    public Annual(String employeeId, LocalDate annualLeaveDate) {
        this.employeeId = employeeId;
        this.annualLeaveDate = annualLeaveDate;
    }

}
