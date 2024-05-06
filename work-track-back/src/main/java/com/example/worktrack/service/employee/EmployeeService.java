package com.example.worktrack.service.employee;

import com.example.worktrack.dto.employee.request.EmployeeCreateRequest;
import com.example.worktrack.dto.employee.response.EmployeeResponse;
import com.example.worktrack.entity.Department;
import com.example.worktrack.entity.Employee;
import com.example.worktrack.entity.User;
import com.example.worktrack.global.login.Role;
import com.example.worktrack.repository.DepartmentRepository;
import com.example.worktrack.repository.EmployeeRepository;
import com.example.worktrack.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    // 직원 조회
    @Transactional

    public List<EmployeeResponse> getEmployee(String query) {
        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException("검색 조건을 입력해주세요.");
        }

        List<Employee> targetEmployeeList = employeeRepository.findAllByUser_NameContaining(query);

        if(targetEmployeeList == null || targetEmployeeList.isEmpty()) {
            throw new IllegalArgumentException("직원 정보가 없습니다.");
        }

        return targetEmployeeList.stream()
                .map(EmployeeResponse::new)
                .collect(Collectors.toList());
    }

    // 직원 등록
    @Transactional
    public void saveEmployee(EmployeeCreateRequest request) {
        // 1. memberId로 회원가입한 유저 찾기
        User targetUser = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("해당 회원을 찾을 수 없습니다. 회원가입을 먼저 진행해주세요."));

        // 2. 이미 직원으로 등록된 회원을 중복 등록하려는 경우
        employeeRepository.findByUser(targetUser).ifPresent(employee -> {
            throw new IllegalArgumentException("이미 직원으로 등록된 회원입니다.");
        });

        // 3. departmentId로 부서 찾기
        Department targetDepartment = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("해당 부서를 찾을 수 없습니다."));

        // 4. 해당 부서에 사원 수 추가 및 직급이 매니저인 직원 추가
        if (targetUser.getAuth() == Role.MANAGER) {
            targetDepartment.addManager(targetUser.getName());
        }

        targetDepartment.increaseMemberCount();

        // 5. 직원 엔티티로 변환
        Employee employee = request.toEntity(targetUser, request.getDepartmentId(), request.getBirthday(), request.getWorkStartDate());

        // 6. DB에 저장
        employeeRepository.save(employee);
        departmentRepository.save(targetDepartment);
    }

    // 직원 삭제
    @Transactional
    public void deleteEmployee(String employeeId) {
        // 1. 직원 찾기
        Employee targetEmployee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 직원을 찾을 수 없습니다."));

        // 2. 부서 찾기
        Department targetDepartment = departmentRepository.findById(targetEmployee.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("해당 부서를 찾을 수 없습니다."));


        targetDepartment.decreaseMemberCount(); // 직원 카운트 감소

        if (targetEmployee.getUser().getAuth() == Role.MANAGER) {
            targetDepartment.removeManager(targetEmployee.getUser().getName());
        }

        employeeRepository.delete(targetEmployee);
        departmentRepository.save(targetDepartment);
    }

}
