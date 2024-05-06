package com.example.worktrack.dto.channel.request;

import com.example.worktrack.entity.Channel;
import lombok.Getter;

@Getter
public class ChannelCreationRequest {

    private String title;
    private String description;

    public Channel toEntity(String title, String description) {
        return new Channel(title, description);
    }

}
