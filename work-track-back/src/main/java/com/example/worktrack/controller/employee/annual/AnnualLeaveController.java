package com.example.worktrack.controller.employee.annual;

import com.example.worktrack.dto.employee.request.annual.AnnualLeaveRequest;
import com.example.worktrack.dto.employee.response.annual.RemainingLeavesResponse;
import com.example.worktrack.service.employee.annual.AnnualLeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class AnnualLeaveController {

    private final AnnualLeaveService annualLeaveService;

    // 연차 사용
    @PostMapping("/annual")
    public void annualLeave(@RequestBody AnnualLeaveRequest request) {
        annualLeaveService.annualLeave(request);
    }

    // 남은 연차 조회
    @GetMapping("/annual")
    public ResponseEntity<RemainingLeavesResponse> getEmployeeAnnualLeaveByDate(@RequestParam String employeeId) {
        RemainingLeavesResponse remainingLeaves = annualLeaveService.getEmployeeAnnualLeaveByDate(employeeId);

        return ResponseEntity.status(HttpStatus.OK).body(remainingLeaves);
    }
}
