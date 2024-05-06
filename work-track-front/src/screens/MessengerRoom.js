import React, { useState, useEffect, useLayoutEffect, useContext, useRef } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { Alert } from 'react-native';
import axios from 'axios';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { MaterialIcons } from '@expo/vector-icons';
import { ProgressContext } from '../contexts/Progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../contexts';

const Container = styled.View`
    flex: 1;
    background-color: ${({theme}) => theme.background};
`;

const Avatar = styled.Image`
  width: 40px; 
  height: 40px;
  borderRadius: 20px;  
  background-color: ${({theme}) => theme.profileImageBackground};  
`;

const SendButton = (props) => {
    const theme = useContext(ThemeContext);

    return (
        <Send
            {...props}
            disabled={!props.text}
            containerStyle={{
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 4,
            }}
        >
            <MaterialIcons
                name="send"
                size={24}
                color={
                    props.text ? theme.sendButtonActivate : theme.sendButtonInactivate
                }
            />
        </Send>
    );
};

const MessengerRoom = ({ navigation, route: { params } }) => {
    const theme = useContext(ThemeContext);
    const { spinner } = useContext(ProgressContext);
    const { currentUser } = useContext(UserContext);

    const [messages, setMessages] = useState([]);
    const ws = useRef(null);

    useLayoutEffect(() => {
        navigation.setOptions({ headerTitle: params.title || '메신저룸' });
    }, []);

    useEffect(() => {
        // 초기 메시지 로딩
        getMessages();

        // 웹소켓 연결 설정
        const websocket = new WebSocket(`ws://192.168.35.131:8080/ws/message/${params.id}`);
        ws.current = websocket;

        websocket.onopen = () => {
            console.log('웹소켓 연결 성공');
        };

        websocket.onmessage = (e) => {
            const data = JSON.parse(e.data);

            // 메시지 수신 처리 
            const newMessages = data.messages.map((msg) => ({
                _id: msg.id,
                text: msg.text,
                createdAt: new Date(msg.createdAt),
                user: {
                    _id: msg.employee.id,
                    name: msg.employee.user.name,
                    avatar: msg.employee.user.profileUrl
                }
            }));

            // id 중복값 제거 및 상태 업데이트
            const updatedMessages = newMessages.filter(newMsg => {
                return !messages.some(existingMsg => existingMsg._id === newMsg._id);
            });
            updatedMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setMessages(updatedMessages);
        };

        websocket.onerror = (e) => {
            console.error('WebSocket Error: ', e.message);
        };

        websocket.onclose = (e) => {
            console.log('웹소켓 연결 끊김: ', e.reason);
        };

        return () => {
            websocket.close();
        };
    }, []);  
    

    // 메시지 전송 처리 
    const sendMessage = (messageList) => {
        const message = messageList[0];

        const messageData = {
            text: message.text,
            channelsId: params.id,
            employeeId: currentUser.employeeId,
        }
        
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(messageData));
        } else {
            console.error('웹 소켓이 연결되지 않음');
        }
    };

    // 전체 메시지 조회 (처음 로딩 시)
    const getMessages = async () => {
        try {
            spinner.start();
            const accessToken = await AsyncStorage.getItem('accessToken');

            const response = await axios.get(`http://192.168.35.131:8080/message/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const formattedMessages = response.data.messages.map((msg) => ({
                _id: msg.id,
                text: msg.text,
                createdAt: new Date(msg.createdAt),
                user: {
                    _id: msg.employee.id,
                    name: msg.employee.user.name,
                    avatar: msg.employee.user.profileUrl
                }
            }));
            formattedMessages.sort((a, b) => b.createdAt - a.createdAt);

            setMessages(formattedMessages);
        }
        catch (error) {
            Alert.alert('메시지 로드 실패', `${error.response.data.message}`)
        }
        finally {
            spinner.stop();
        }
    }
    
    return (
        <Container>
            <GiftedChat
                listViewProps={{
                    style: { backgroundColor: theme.background },  
                }}
                placeholder="여기에 메시지 입력..."
                messages={messages}
                user={{
                    _id: currentUser.employeeId,
                    name: currentUser.name,
                    avatar: currentUser.profileUrl
                }}
                onSend={messages => sendMessage(messages)}
                alwaysShowSend={true}  // 항상 전송 버튼 표시
                textInputProps={{
                    autoCapitalize: 'none',  
                    autoCorrect: false, 
                    textContentType: 'none', 
                    underlineColorAndroid: 'transparent', 
                }}
                multiline={true}  // 여러 줄 입력 허용
                renderUsernameOnMessage={true}  // 사용자 이름 표시
                scrollToBottom={true}  // 자동 하단 스크롤 허용
                renderSend={props => <SendButton {...props} />}
                renderAvatar={props => (
                    <Avatar source={{ uri: props.currentMessage.user.avatar }} />
                )}
                inverted={true}
            />
        </Container>
    );
};

export default MessengerRoom;
