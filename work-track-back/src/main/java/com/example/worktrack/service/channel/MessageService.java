package com.example.worktrack.service.channel;

import com.example.worktrack.dto.channel.request.MessageRequest;
import com.example.worktrack.dto.channel.response.MessageResponse;
import com.example.worktrack.entity.Channel;
import com.example.worktrack.entity.Employee;
import com.example.worktrack.entity.Message;
import com.example.worktrack.repository.ChannelRepository;
import com.example.worktrack.repository.EmployeeRepository;
import com.example.worktrack.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class MessageService {

    private final ChannelRepository channelRepository;
    private final EmployeeRepository employeeRepository;
    private final MessageRepository messageRepository;

    // 메시지 저장
    public MessageResponse saveMessage(MessageRequest request) {

        // 1. 채널 찾기
        Channel targetChannel = channelRepository.findById(request.getChannelsId())
                .orElseThrow(() -> new IllegalArgumentException("해당 메신저룸을 찾을 수 없습니다.."));

        // 2. 직원 찾기
        Employee targetEmployee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("해당 직원을 찾을 수 없습니다."));

        // 3. 메시지 저장
        Message message = request.toEntity(request.getText(), targetEmployee);
        Message saveMessage = messageRepository.save(message);

        // 4. 채널에 메시지 컬렉션 저장
        targetChannel.addMessage(saveMessage);
        return new MessageResponse(channelRepository.save(targetChannel));
    }

    // 메시지 반환
    public MessageResponse getMessages(String channelId) {
        Channel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new IllegalArgumentException("해당 메시지가 존재하지 않습니다."));

        return new MessageResponse(channel);
    }
}
