package com.example.worktrack.service.channel;

import com.example.worktrack.dto.channel.request.ChannelCreationRequest;
import com.example.worktrack.dto.channel.response.ChannelResponse;
import com.example.worktrack.entity.Channel;
import com.example.worktrack.repository.ChannelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ChannelService {

    private final ChannelRepository channelRepository;

    // 메신저룸 생성
    public ChannelResponse saveChannel(ChannelCreationRequest request) {
        // 1. 엔티티로 변환
        Channel channel = request.toEntity(request.getTitle(), request.getDescription());
        // 2. DB에 저장 후 반환
        return new ChannelResponse(channelRepository.save(channel));
    }

    // 메신저룸 조회
    public List<ChannelResponse> getChannelList() {
        List<Channel> channels = channelRepository.findAll();

        return channels.stream()
                .map(ChannelResponse::new)
                .collect(Collectors.toList());
    }
}
