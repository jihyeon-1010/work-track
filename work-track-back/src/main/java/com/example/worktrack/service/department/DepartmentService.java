package com.example.worktrack.service.department;

import com.example.worktrack.dto.department.request.DepartmentCreateRequest;
import com.example.worktrack.dto.department.response.DepartmentResponse;
import com.example.worktrack.entity.Department;
import com.example.worktrack.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    // 부서 등록
    @Transactional
    public void saveDepartment(DepartmentCreateRequest request) {
        Department department = request.toEntity(request.getName(), request.getMinimumNoticeDays());

        departmentRepository.save(department);
    }

    // 부서 조회
    public List<DepartmentResponse> getDepartments() {
        return departmentRepository.findAll()
                .stream().map(DepartmentResponse::new)
                .collect(Collectors.toList());
    }
}
