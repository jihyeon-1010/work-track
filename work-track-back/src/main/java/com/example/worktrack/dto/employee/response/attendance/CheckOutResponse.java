package com.example.worktrack.dto.employee.response.attendance;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalTime;

@AllArgsConstructor
@Getter
public class CheckOutResponse {

    private LocalTime checkOutTime;
    private String notes;

}
