package com.example.worktrack.service.employee.worktime;

import com.example.worktrack.dto.employee.request.attendance.AttendanceRequest;
import com.example.worktrack.dto.employee.response.attendance.CheckInResponse;
import com.example.worktrack.dto.employee.response.attendance.CheckOutResponse;
import com.example.worktrack.dto.employee.response.attendance.EmployeeWorkingMinutesResponse;
import com.example.worktrack.dto.employee.response.attendance.WorkSummaryResponse;
import com.example.worktrack.entity.Annual;
import com.example.worktrack.entity.Attendance;
import com.example.worktrack.repository.WorkTimeRepository;
import com.example.worktrack.repository.AnnualLeaveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class WorkTimeService {

    private final WorkTimeRepository workTimeRepository;
    private final AnnualLeaveRepository annualLeaveRepository;

    // 정식 출퇴근 시간 지정
    private static final LocalTime STANDARD_CHECK_IN_TIME = LocalTime.of(9, 0);
    private static final LocalTime STANDARD_CHECK_OUT_TIME = LocalTime.of(18, 0);

    // 출근 처리
    @Transactional
    public CheckInResponse checkIn(AttendanceRequest request) {
        // 1. 엔티티로 변환
        Attendance attendance = request.toEntiry(request.getEmployeeId(), request.getNotes());

        // 2. 예외 처리
        // 2-1. 정식 출근 시간보다 1시간 이상 일찍 출근 버튼 클릭할 경우
        if (calculateEarlyCheckInDuration(attendance)) {
            throw new IllegalArgumentException("출근 시간이 너무 일찍 찍혔습니다. 정상 출근 시간을 확인해 주세요.");
        }

        // 2-2. 같은 날짜에 이미 출근 처리된 직원이 다시 출근하려는 경우
        Attendance existingCheckInRecords = checkDuplicateCheckIn(attendance);
        if (existingCheckInRecords != null) {
            throw new IllegalArgumentException("이미 출근 처리 되었습니다.");
        }

        // 2-3. 정식 출근 시간보다 늦게 출근 버튼 클릭 && 지각 사유란이 공란일 경우
        if (calculateLateCheckInDuration(attendance)) {
            throw new IllegalArgumentException("지각 처리되었습니다. 비고란에 지각 사유를 입력한 후 다시 출근 처리해주세요.");
        }

        Attendance checkIn = workTimeRepository.save(attendance);
        return new CheckInResponse(checkIn.getCheckInTime(), checkIn.getNotes());
    }

    // 퇴근 처리
    @Transactional
    public CheckOutResponse checkOut(AttendanceRequest request) {
        // 1. 직원 id와 현재 날짜로 해당 직원의 출근 기록 가져오기 / 퇴근하려는 직원이 아직 미출근 상태인 경우 예외 처리
        Attendance targetAttendance = checkAbsenteeism(request);
        if (targetAttendance == null) {
            throw new IllegalArgumentException("아직 출근 처리가 되지 않았습니다. 출근 처리 먼저 진행해주세요.");
        }

        // 해당 직원 퇴근 처리
        targetAttendance.checkOut(request.getNotes());

        Attendance checkOut = workTimeRepository.save(targetAttendance);

        return new CheckOutResponse(checkOut.getCheckOutTime(), checkOut.getNotes());
    }

    // 특정 직원의 날짜별 근무 시간 조회 (연차 사용 여부 포함)
    @Transactional
    public WorkSummaryResponse getEmployeeWorkingMinutesByDate(String employeeId, YearMonth yearMonth) {
        List<EmployeeWorkingMinutesResponse> workingMinutesList = new ArrayList<>();

        // 주어진 연도와 월에 해당하는 첫째 날과 마지막 날 가져오기
        LocalDate firstDayOfMonth = yearMonth.atDay(1);
        LocalDate lastDayOfMonth = yearMonth.atEndOfMonth();

        // 각 날짜별 근무 시간을 계산하고 리스트에 추가
        LocalDate currentDate = firstDayOfMonth;
        while (!currentDate.isAfter(lastDayOfMonth)) {
            Attendance attendance = workTimeRepository.findByDateAndEmployeeId(currentDate, employeeId)
                    .orElse(null);

            boolean usingDayOff = false; // 기본값은 연차를 사용하지 않은 것으로 설정
            Annual annual = annualLeaveRepository.findByAnnualLeaveDateAndEmployeeId(currentDate, employeeId);

            // 지정된 날짜에 출퇴근 기록이 없는 경우 처리
            if (attendance == null) {
                if (annual != null) {
                    usingDayOff = true;
                }
                workingMinutesList.add(new EmployeeWorkingMinutesResponse(currentDate, 0, usingDayOff));
            } else {
                // 출근 기록이 있는 경우
                // 만약 직원이 퇴근하지 않았다면 현재 시간을 퇴근 시간으로 사용
                LocalTime checkOutTime = attendance.getCheckOutTime() != null ?
                        attendance.getCheckOutTime() : LocalTime.now();

                // 근무 시간을 분 단위로 계산
                long workMinutes = Duration.between(attendance.getCheckInTime(), checkOutTime).toMinutes();

                workingMinutesList.add(new EmployeeWorkingMinutesResponse(currentDate, workMinutes, usingDayOff));
            }
            currentDate = currentDate.plusDays(1);
        }

        // 근무 시간 총계 계산
        long totalWorkMinutes = workingMinutesList.stream()
                .mapToLong(EmployeeWorkingMinutesResponse::getWorkingMinutes)
                .sum();

        return new WorkSummaryResponse(workingMinutesList, totalWorkMinutes);
    }

    public boolean calculateEarlyCheckInDuration(Attendance attendance) {
        return Duration.between(attendance.getCheckInTime(), STANDARD_CHECK_IN_TIME).toMinutes() >= 60;
    }

    public Attendance checkDuplicateCheckIn(Attendance attendance) {
        return workTimeRepository.findByDateAndEmployeeId(
                attendance.getDate(),
                attendance.getEmployeeId()).orElse(null);
    }

    public boolean calculateLateCheckInDuration(Attendance attendance) {
        return attendance.getCheckInTime().isAfter(STANDARD_CHECK_IN_TIME) && attendance.getNotes() == null;
    }

    public Attendance checkAbsenteeism(AttendanceRequest request) {
        return workTimeRepository.findByDateAndEmployeeId(
                request.getDate(),
                request.getEmployeeId()).orElse(null);
    }
}
