package com.example.worktrack.service.employee.annual;

import com.example.worktrack.dto.employee.request.annual.AnnualLeaveRequest;
import com.example.worktrack.dto.employee.response.annual.RemainingLeavesResponse;
import com.example.worktrack.entity.Annual;
import com.example.worktrack.entity.Department;
import com.example.worktrack.entity.Employee;
import com.example.worktrack.repository.DepartmentRepository;
import com.example.worktrack.repository.EmployeeRepository;
import com.example.worktrack.repository.AnnualLeaveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@RequiredArgsConstructor
@Service
public class AnnualLeaveService {

    private final AnnualLeaveRepository annualLeaveRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    // 연차 사용
    @Transactional
    public void annualLeave(AnnualLeaveRequest request) {
        // 1. 직원 찾기
        Employee targetEmployee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("해당 직원을 찾을 수 없습니다."));

        // 2. 부서 찾기
        Department targetDepartment = departmentRepository.findById(targetEmployee.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("해당 부서를 찾을 수 없습니다."));

        // 3-1. 현재 날짜보다 이전 날짜에 연차 신청을 시도하는 경우
        if (!validateFutureLeaveDate(request)) {
            throw new IllegalArgumentException("연차 신청 날짜는 현재 날짜 이후여야 합니다.");
        }

        // 3-2. 부서마다 연차 사용 최소 공지 일수 검사
        if (!validateLeaveApplicationDate(request, targetDepartment)) {
            throw new IllegalArgumentException(targetDepartment.getName() +
                    "의 연차 신청은 최소 " +
                    targetDepartment.getMinimumNoticeDays() +
                    "일 전에 해야 합니다.");
        }

        // 3-3. 입사 년도를 기준으로 총 연차 사용 개수 검사
        int remainingLeaves = hasSufficientAnnualLeave(targetEmployee);

        if (remainingLeaves <= 0) {
            throw new IllegalArgumentException("연차 잔여 일수가 부족합니다.");
        }

        Annual annual = request.toEntity(request.getEmployeeId(), request.getAnnualLeaveDate());
        annualLeaveRepository.save(annual);
    }

    // 남은 연차 조회
    @Transactional
    public RemainingLeavesResponse getEmployeeAnnualLeaveByDate(String employeeId) {
        // 1. 직원 찾기
        Employee targetEmployee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 직원을 찾을 수 없습니다."));

        // 2. 입사 년도를 기준으로 총 연차 사용 개수 검사
        int remainingLeaves = hasSufficientAnnualLeave(targetEmployee);

        return new RemainingLeavesResponse(remainingLeaves);
    }

    private boolean validateFutureLeaveDate(AnnualLeaveRequest request) {
        LocalDate today = LocalDate.now();
        LocalDate leaveDate = request.getAnnualLeaveDate();

        return leaveDate.isAfter(today);
    }

    private boolean validateLeaveApplicationDate(AnnualLeaveRequest request, Department department) {
        LocalDate leaveDate = request.getAnnualLeaveDate();
        LocalDate latestAllowedDate = leaveDate.minusDays(department.getMinimumNoticeDays());
        LocalDate today = LocalDate.now();

        return today.isBefore(latestAllowedDate);
    }

    private int hasSufficientAnnualLeave(Employee employee) {
        // 올해 입사한 직원은 11개, 그 외는 15개
        // 만약 입사 날짜가 2022년 12월 31일이고, 현재 날짜가 2023년 1월 1일이라도 작년과 올해로 분류
        int workStartDate = employee.getWorkStartDate().getYear();
        int currentYear = LocalDate.now().getYear();
        int totalLeaves = (workStartDate == currentYear) ? 11 : 15;

        LocalDate startOfYear = getStartOfYear(currentYear);
        LocalDate endOfYear = getEndOfYear(currentYear);

        int usedLeaves = annualLeaveRepository.countByEmployeeIdAndAnnualLeaveDateBetween(employee.getId(), startOfYear, endOfYear);

        return totalLeaves - usedLeaves;
    }

    // 연도의 시작일을 가져오는 유틸리티 메서드
    private LocalDate getStartOfYear(int year) {
        return LocalDate.of(year, 1, 1); // 해당 연도의 1월 1일
    }

    // 연도의 마지막 날을 가져오는 유틸리티 메서드
    private LocalDate getEndOfYear(int year) {
        return LocalDate.of(year, 12, 31); // 해당 연도의 12월 31일
    }
}
