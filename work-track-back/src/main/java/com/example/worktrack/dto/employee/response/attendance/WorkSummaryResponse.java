package com.example.worktrack.dto.employee.response.attendance;

import com.example.worktrack.dto.employee.response.attendance.EmployeeWorkingMinutesResponse;
import lombok.Getter;

import java.util.List;

@Getter
public class WorkSummaryResponse {

    private List<EmployeeWorkingMinutesResponse> detail;
    private long sum;

    public WorkSummaryResponse(List<EmployeeWorkingMinutesResponse> detail, long sum) {
        this.detail = detail;
        this.sum = sum;
    }
}
