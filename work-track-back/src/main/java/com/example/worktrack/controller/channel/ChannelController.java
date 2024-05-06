package com.example.worktrack.controller.channel;

import com.example.worktrack.dto.channel.request.ChannelCreationRequest;
import com.example.worktrack.dto.channel.response.ChannelResponse;
import com.example.worktrack.service.channel.ChannelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class ChannelController {

    private final ChannelService channelService;

    // 메신저룸 생성
    @PostMapping("/channel")
    public ResponseEntity<ChannelResponse> saveChannel(@RequestBody ChannelCreationRequest request) {
        ChannelResponse channelResponse = channelService.saveChannel(request);

        return ResponseEntity.status(HttpStatus.OK).body(channelResponse);
    }

    // 메신저룸 조회
    @GetMapping("/channel")
    public ResponseEntity<List<ChannelResponse>> getChannelList() {
        List<ChannelResponse> channelResponse = channelService.getChannelList();

        return ResponseEntity.status(HttpStatus.OK).body(channelResponse);
    }
}
