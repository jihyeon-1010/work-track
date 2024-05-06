package com.example.worktrack.dto.channel.response;

import com.example.worktrack.entity.Channel;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
public class ChannelResponse {

    private String id;
    private String title;
    private String description;
    private LocalDateTime createdAt;

    public ChannelResponse(Channel channel) {
        this.id = channel.getId();
        this.title = channel.getTitle();
        this.description = channel.getDescription();
        this.createdAt = channel.getCreatedAt();
    }

}
