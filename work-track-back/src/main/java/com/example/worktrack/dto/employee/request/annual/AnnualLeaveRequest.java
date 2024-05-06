package com.example.worktrack.dto.employee.request.annual;

import com.example.worktrack.entity.Annual;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class AnnualLeaveRequest {

    private String employeeId;
    private LocalDate annualLeaveDate;

    public Annual toEntity(String employeeId, LocalDate annualLeaveDate) {
        return new Annual(employeeId, annualLeaveDate);
    }
}
