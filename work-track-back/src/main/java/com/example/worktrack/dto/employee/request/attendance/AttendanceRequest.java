package com.example.worktrack.dto.employee.request.attendance;

import com.example.worktrack.entity.Attendance;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class AttendanceRequest {

    private String employeeId;
    private LocalDate date = LocalDate.now();
    private String notes;

    public Attendance toEntiry(String employeeId, String notes) {
        return new Attendance(employeeId, notes);
    }

}
