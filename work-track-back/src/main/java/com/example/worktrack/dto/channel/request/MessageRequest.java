package com.example.worktrack.dto.channel.request;

import com.example.worktrack.entity.Employee;
import com.example.worktrack.entity.Message;
import lombok.Getter;

@Getter
public class MessageRequest {

    private String employeeId;
    private String channelsId;
    private String text;

    public Message toEntity(String text, Employee employee) {
        return new Message(text, employee);
    }

}
