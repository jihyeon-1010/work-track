package com.example.worktrack.controller.employee.worktime;

import com.example.worktrack.dto.employee.request.attendance.AttendanceRequest;
import com.example.worktrack.dto.employee.response.attendance.CheckInResponse;
import com.example.worktrack.dto.employee.response.attendance.CheckOutResponse;
import com.example.worktrack.dto.employee.response.attendance.WorkSummaryResponse;
import com.example.worktrack.service.employee.worktime.WorkTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;

@RequiredArgsConstructor
@RestController
@RequestMapping("/attendance")
public class WorkTimeController {

    private final WorkTimeService workTimeService;

    // 출근 처리
    @PostMapping("/check-in")
    public ResponseEntity<CheckInResponse> checkIn(@RequestBody AttendanceRequest request) {
        CheckInResponse checkIn = workTimeService.checkIn(request);

        return ResponseEntity.status(HttpStatus.OK).body(checkIn);
    }

    // 퇴큰 처리
    @PostMapping("/check-out")
    public ResponseEntity<CheckOutResponse> checkOut(@RequestBody AttendanceRequest request) {
        CheckOutResponse checkOut =  workTimeService.checkOut(request);

        return ResponseEntity.status(HttpStatus.OK).body(checkOut);
    }

    // 특정 직원의 날짜별 근무 시간 조회
    @GetMapping("/work-minutes")
    public ResponseEntity<WorkSummaryResponse> getEmployeeWorkingMinutesByDate(@RequestParam String employeeId, YearMonth yearMonth) {
        WorkSummaryResponse workingMinutes = workTimeService.getEmployeeWorkingMinutesByDate(employeeId, yearMonth);

        return ResponseEntity.status(HttpStatus.OK).body(workingMinutes);
    }

}
