package com.example.worktrack.entity;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.*;

@Getter
@Document(collection = "attendance")
public class Attendance {

    @Id
    private String id;

    private String employeeId;

    private LocalTime checkInTime;

    private LocalTime checkOutTime;

    private LocalDate date;

    private boolean isPresent;

    private String notes;

    public Attendance(String employeeId, String notes) {
        this.employeeId = employeeId;
        this.checkInTime = LocalTime.now();
        this.date = LocalDate.now();
//        this.date = LocalDate.of(2024, 5,1);
        this.checkInTime = LocalTime.of(8, 30);
        this.isPresent = true;
        this.notes = notes;
    }

    public void checkOut(String notes) {
        this.notes = notes;
//        this.checkOutTime = LocalTime.now();
        this.checkOutTime = LocalTime.of(23, 0);
        this.isPresent = false;
    }
}
