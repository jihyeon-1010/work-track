package com.example.worktrack.dto.department.request;

import com.example.worktrack.entity.Department;
import lombok.Getter;

@Getter
public class DepartmentCreateRequest {

    private String name;
    private int minimumNoticeDays;

    public Department toEntity(String name, int minimumNoticeDays) {
        return new Department(name, minimumNoticeDays);
    }

}
