package com.example.worktrack.entity;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Getter
@Setter
@Document(collection = "department")
public class Department {

    @Id
    private String id;

    @NotNull
    private String name;

    private ArrayList<String> managerNameList = new ArrayList<>();

    private long memberCount = 0;

    private int minimumNoticeDays;

    public Department(String name, int minimumNoticeDays) {
        this.name = name;
        this.minimumNoticeDays = minimumNoticeDays;
    }

    public void addManager(String managerName) {
        this.managerNameList.add(managerName);
    }

    public void removeManager(String managerName) {
        System.out.println(managerName);
        this.managerNameList.remove(managerName);
        System.out.println(managerNameList);
    }

    public void increaseMemberCount() {
        this.memberCount += 1;
    }

    public void decreaseMemberCount() {
        System.out.println(this.memberCount -= 1);
    }

}
