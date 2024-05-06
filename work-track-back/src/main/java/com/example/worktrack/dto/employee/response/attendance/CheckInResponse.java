package com.example.worktrack.dto.employee.response.attendance;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalTime;

@Getter
@AllArgsConstructor
public class CheckInResponse {

    private LocalTime checkInTime;
    private String notes;

}
