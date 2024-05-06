package com.example.worktrack.dto.department.response;

import com.example.worktrack.entity.Department;
import lombok.Getter;

import java.util.List;

@Getter
public class DepartmentResponse {

    private String id;
    private String name;
    private List<String> managerNameList;
    private long memberCount;

    public DepartmentResponse(Department department) {
        this.id = department.getId();
        this.name = department.getName();
        this.managerNameList = department.getManagerNameList();
        this.memberCount = department.getMemberCount();
    }
}
