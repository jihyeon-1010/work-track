package com.example.worktrack.controller.employee;

import com.example.worktrack.dto.employee.request.EmployeeCreateRequest;
import com.example.worktrack.dto.employee.response.EmployeeResponse;
import com.example.worktrack.service.employee.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class EmployeeController {

    private final EmployeeService employeeService;

    // 직원 조회
    @GetMapping("/employee")
    public ResponseEntity<List<EmployeeResponse>> getEmployee(@RequestParam String query) {
        List<EmployeeResponse> employeeResponseList = employeeService.getEmployee(query);

        return ResponseEntity.status(HttpStatus.OK).body(employeeResponseList);
    }

    // 직원 등록
    @PostMapping("/employee")
    public void saveEmployee(@RequestBody EmployeeCreateRequest request) {
        employeeService.saveEmployee(request);
    }

    // 직원 삭제
    @DeleteMapping("/employee")
    public void deleteEmployee(@RequestParam String employeeId) {
        employeeService.deleteEmployee(employeeId);
    }
}
