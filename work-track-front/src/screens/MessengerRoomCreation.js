import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { ProgressContext } from '../contexts';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Input, Button } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
    justify-content: center;
    align-items: center;
    padding: 0 20px;
`;

const ErrorText = styled.Text`
    align-items: flex-start;
    width: 100%;
    height: 20px;
    margin-bottom: 10px;
    line-height: 20px;
    color: ${({theme}) => theme.errorText};
`;

const MessengerRoomCreation = ({ navigation }) => {
    const { spinner } = useContext(ProgressContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const descriptionRef = useRef();
    const [errorMessage, setErrorMessage] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [channel, setChannel] = useState(null);

    useEffect(() => {
        setDisabled(!(title && !errorMessage));
    }, [title, description, errorMessage]);

    const _handleTitleChange = (title) => {
        setTitle(title);
        setErrorMessage(title.trim() ? '' : '채팅방 이름을 입력해주세요.');
    };

    // 메신저룸 생성 클릭
    const _handleCreateButtonPress = async () => {
        spinner.start();
        const accessToken = await AsyncStorage.getItem('accessToken');

        const channel = {
            title: title,
            description: description
        };

        try {
            const response = await axios.post("http://192.168.35.131:8080/channel", channel, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });

            Alert.alert('메신저룸 생성 성공', '새로운 메신저룸이 생성되었습니다.');
            navigation.replace('MessengerRoom', { id: response.data.id, title: response.data.title });
            setChannel(response.data);
        }
        catch (error) {
            Alert.alert('메신저룸 생성 실패', `${error.response.data.message}`);
        }
        finally {
            spinner.stop();
            setTitle('');
            setDescription('');
        }
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            extraScrollHeight={20}
        >
            <Container>
                <Input 
                    label="메신저룸 이름"
                    value={title}
                    onChangeText={_handleTitleChange}
                    onSubmitEditing={() => {
                        setTitle(title.trim());
                        descriptionRef.current.focus();
                    }} 
                    onBlur={() => setTitle(title.trim())}
                    placeholder="메신저룸 이름을 입력해주세요."
                    returnKeyType="next"
                    maxLength={20}
                />
                <ErrorText>{errorMessage}</ErrorText>

                <Input
                    ref={descriptionRef}
                    label="메신저룸 설명"
                    value={description}
                    onChangeText={text => setDescription(text)}
                    onSubmitEditing={() => {
                        setDescription(description.trim());
                        _handleCreateButtonPress();
                    }}
                    onBlur={() => setDescription(description.trim())}
                    placeholder="메신저룸에 대해 간단한 설명을 작성해주세요."
                    returnKeyType="done"
                    maxLength={40}
                />    
      
                <Button
                    title='메신저룸 생성'
                    onPress={_handleCreateButtonPress}
                    disabled={disabled}
                    containerStyle={{ marginTop: 35 }}
                />                
            </Container>
        </KeyboardAwareScrollView>
    );
};

export default MessengerRoomCreation;
