package com.example.worktrack.controller.department;

import com.example.worktrack.dto.department.request.DepartmentCreateRequest;
import com.example.worktrack.dto.department.response.DepartmentResponse;
import com.example.worktrack.service.department.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class DepartmentController {

    private final DepartmentService departmentService;

    // 부서 등록
    @PostMapping("/department")
    public void saveDepartment(@RequestBody DepartmentCreateRequest request) {
        departmentService.saveDepartment(request);
    }

    // 부서 조회
    @GetMapping("/department")
    public ResponseEntity<List<DepartmentResponse>> getDepartments() {
        List<DepartmentResponse> departmentResponse = departmentService.getDepartments();

        return ResponseEntity.status(HttpStatus.OK).body(departmentResponse);
    }
}
