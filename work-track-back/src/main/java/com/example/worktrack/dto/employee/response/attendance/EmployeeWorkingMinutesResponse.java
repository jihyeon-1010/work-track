package com.example.worktrack.dto.employee.response.attendance;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class EmployeeWorkingMinutesResponse {

    private LocalDate date;
    private long workingMinutes;
    private boolean usingDayOff;

    public EmployeeWorkingMinutesResponse(LocalDate date, long workingMinutes, boolean usingDayOff) {
        this.date = date;
        this.workingMinutes = workingMinutes;
        this.usingDayOff = usingDayOff;
    }

}
