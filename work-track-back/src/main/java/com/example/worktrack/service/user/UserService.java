package com.example.worktrack.service.user;

import com.example.worktrack.dto.user.request.UserCreateRequest;
import com.example.worktrack.dto.user.request.UserUpdateRequest;
import com.example.worktrack.dto.user.response.AuthenticatedUserResponse;
import com.example.worktrack.dto.user.response.UserResponse;
import com.example.worktrack.entity.Department;
import com.example.worktrack.entity.Employee;
import com.example.worktrack.entity.User;
import com.example.worktrack.global.login.Role;
import com.example.worktrack.repository.DepartmentRepository;
import com.example.worktrack.repository.EmployeeRepository;
import com.example.worktrack.repository.user.UserRepository;
import com.example.worktrack.service.aws.AwsS3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserService {

    private final AwsS3Service s3Service;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    // 회원가입
    @Transactional
    public void signup(UserCreateRequest request) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // 1. 예외 처리
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // 2. 이미지가 'https'로 시작하면 바로 db에 저장하고, Base64일 경우 AWS S3에 업로드 후 URL을 가져옴
        String profileUrl;
        if (request.getProfileImg().startsWith("https")) {
            profileUrl = request.getProfileImg();
        } else {
            profileUrl = s3Service.uploadProfileImage(request.getEmail(), request.getProfileImg());
        }

        // 3. auth 필터링
        Role auth = null;
        if (request.getAuth().equals("employee")) {
            auth = Role.EMPLOYEE;
        } else if (request.getAuth().equals("manager")){
            auth = Role.MANAGER;
        }

        // 4. DB에 저장
        userRepository.save(new User(
                request.getName(),
                request.getEmail(),
                encoder.encode(request.getPassword()),
                profileUrl,
                auth));
    }

    // 인증된 사용자 정보 반환
    @Transactional
    public AuthenticatedUserResponse getAuthentication(Principal principal) {
        // 1. 인증된 사용자 이메일 추출
        String email = principal.getName();

        // 2. 이메일로 사용자 정보 가져오기
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보가 없습니다."));

        Employee employee = employeeRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("아직 직원으로 등록되지 않은 회원입니다. 직원으로 등록된 후 이용할 수 있습니다."));

        Department department = departmentRepository.findById(employee.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("해당 부서를 찾을 수 없습니다."));

        // 3. DTO로 변환
        return new AuthenticatedUserResponse(
                user.getName(),
                user.getEmail(),
                user.getProfileUrl(),
                user.getAuth().name(),
                department.getName(),
                employee.getId());
    }

    // 검색 조회
    public List<UserResponse> getSearchUser(String query) {
        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException("검색 조건을 입력해주세요.");
        }

        List<User> targetUserList = userRepository.findAllByNameContaining(query);

        if(targetUserList == null || targetUserList.isEmpty()) {
            throw new IllegalArgumentException("사용자 정보가 없습니다.");
        }

        return targetUserList.stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getProfileUrl()))
                .collect(Collectors.toList());
    }

    // 프로필 사진 업데이트
    @Transactional
    public AuthenticatedUserResponse updateProfile(UserUpdateRequest request, Principal principal) {
        // 1. 인증된 사용자 이메일 추출
        String email = principal.getName();

        // 2. 이메일로 사용자 정보 가져오기
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보가 없습니다."));

        Employee employee = employeeRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("아직 직원으로 등록되지 않은 회원입니다. 직원으로 등록된 후 이용할 수 있습니다."));

        Department department = departmentRepository.findById(employee.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("해당 부서를 찾을 수 없습니다."));


        // 3. 이미지가 'https'로 시작하면 바로 업데이트, Base64일 경우 AWS S3에 업로드 후 URL을 가져옴
        String updateProfileUrl;
        if (request.getProfileUrl().startsWith("https")) {
            updateProfileUrl = request.getProfileUrl();
        } else {
            updateProfileUrl = s3Service.uploadProfileImage(user.getEmail(), request.getProfileUrl());
        }

        User updateUser = user.updateProfile(updateProfileUrl);
        userRepository.save(updateUser);

        return new AuthenticatedUserResponse(
                updateUser.getName(),
                updateUser.getEmail(),
                updateUser.getProfileUrl(),
                updateUser.getAuth().name(),
                department.getName(),
                employee.getId());
    }

    // 유저 이메일로 유저를 검색한 후 반환
    @Transactional
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보가 없습니다."));
    }
}
