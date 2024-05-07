import React, { useContext, useState, useRef } from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressContext } from '../contexts/Progress';
import { Button, SelectionModal } from '../components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Alert } from 'react-native';
import { Modal } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { _getDepartments } from '../utils/api/apiHandlers';

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
    padding: 20px;
    align-item: center;
`;

const SectionContainer = styled.View`
    background-color: #ffffff;
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
    shadow-color: #000;
    shadow-offset: {
        width: 0;
        height: 2;
    }
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
    elevation: 5;
`;

const TitleText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const InputContainer = styled.View`
    flex-direction: row;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 5px 15px;
    margin-bottom: 10px;
`;

const SearchInput = styled.TextInput`
    flex: 1;
    font-size: 16px;
    margin-left: 10px;
`;

const ButtonContainer = styled.View`
    margin-top: 20px;
`;

const Department = () => {
    const { spinner } = useContext(ProgressContext);

    const [department, setDepartment] = useState(null);
    const [minimumNoticeDays, setMinimumNoticeDays] = useState(null);

    const minimumNoticeDaysRef = useRef(); 

    // 부서 등록
    const _handleRegisterButtonPress = async () => {
        spinner.start();
        const accessToken = await AsyncStorage.getItem('accessToken');

        const departmentData = {
            name: department,
            minimumNoticeDays: minimumNoticeDays
        };

        try {
            const response = await axios.post("http://192.168.35.131:8080/department", departmentData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            Alert.alert('부서 등록 성공', '부서 등록이 완료되었습니다.');
        } catch (error) {
            Alert.alert('부서 등록 실패', `${error.response.data.message}`);
        } finally {
            spinner.stop();
            setDepartment(null);
            setMinimumNoticeDays(null);
        }
    };

    return (
        <Container>
            {/* 부서 이름 */}
            <SectionContainer>
                <TitleText>부서 이름</TitleText>
                <InputContainer>
                    <MaterialIcons name="search" size={24} color="gray" />
                    <SearchInput
                        onChangeText={text => setDepartment(text)}
                        placeholder="부서 이름 입력.."
                        value={department}
                        returnKeyType='next'
                        onSubmitEditing={() => minimumNoticeDaysRef.current.focus()}
                    />
                </InputContainer>
            </SectionContainer>

            {/* 연차 최소 공지 일수 */}
            <SectionContainer>
                <TitleText>연차 최소 공지 일수</TitleText>
                <InputContainer>
                    <MaterialIcons name="search" size={24} color="gray" />
                    <SearchInput
                        ref={minimumNoticeDaysRef}
                        onChangeText={text => setMinimumNoticeDays(text)}
                        placeholder="연차 최소 공지 일수 입력.."
                        value={minimumNoticeDays}
                        returnKeyType='done'
                        onSubmitEditing={_handleRegisterButtonPress}
                    />
                </InputContainer>
            </SectionContainer>

            {/* 부서 등록 버튼 */}
            <ButtonContainer>
                <Button title="부서 등록" onPress={_handleRegisterButtonPress} />
            </ButtonContainer>
        </Container>
    );
};

export default Department;
