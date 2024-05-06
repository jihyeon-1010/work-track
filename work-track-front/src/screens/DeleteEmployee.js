import React, { useContext, useState } from 'react';
import styled from 'styled-components/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressContext } from '../contexts';
import { Button, SelectionModal } from '../components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Alert } from 'react-native';
import { Modal } from 'react-native-paper';
import { _getDepartments } from '../utils/api/apiHandlers';

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
    padding: 0 20px;
`;

const SearchContainer = styled.View`
    padding: 5px;
    background-color: #f2f2f2;
    border-radius: 5px;
    flex-direction: row;
    align-items: center;
    margin: 10px 0;
`;

const TitleText = styled.Text`
    font-size: 20px;
    font-weight: 600;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  color: #333;
`;

const DeleteEmployee = () => {
    const { spinner } = useContext(ProgressContext);

    const [searchEmployee, setSearchEmployee] = useState('');
    const [employees, setEmployees] = useState([]);
    const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null); 
    const [selectedEmployeeName, setSelectedEmployeeName] = useState(null);

    // 멤버 모달
    const memberToggleModal = () => {
        setIsMemberModalVisible(!isMemberModalVisible);
    };  

    // 모달 취소 버튼
    const _memberCancelButtonPress = () => {
        setSelectedEmployeeId(null);
        memberToggleModal();
    }; 

    // 멤버 선택 버튼 
    const _memberSelectionButtonPress = (memberId) => {
        setSelectedEmployeeId(memberId);
        memberToggleModal();
    } 

    // 직원 조회
    const _handleEmployeeSearch = async () => {
        spinner.start();
        const accessToken = await AsyncStorage.getItem('accessToken');

        try {
            const response = await axios.get("http://192.168.35.131:8080/employee", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    query: searchEmployee
                }
            });

            setEmployees(response.data);
            memberToggleModal();
        }
        catch (error) {
            Alert.alert('회원 검색 실패', `${error.response.data.message}`);
        }
        finally {
            spinner.stop();
            setSearchMember('');
        }
    };

    //직원 삭제 
    const _deleteEmployeeButtonPress = async () => {
        Alert.alert(
            '직원 삭제',
            `${selectedEmployeeName} 직원을 삭제하시겠습니까?`,
            [
                {
                    text: '취소',
                    style: 'cancel',
                },
                {
                    text: '확인',
                    onPress: async () => {
                        spinner.start();
                        const accessToken = await AsyncStorage.getItem('accessToken');
            
                        try {
                            const response = await axios.delete("http://192.168.35.131:8080/employee", {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                                params: {
                                    employeeId: selectedEmployeeId
                                }
                            });
            
                            Alert.alert('직원 삭제 성공', '직원 삭제가 완료되었습니다.');
                        }
                        catch (error) {
                            Alert.alert('직원 삭제 실패', `${error.response.data.message}`);
                        }
                        finally {
                            spinner.stop();
                            setSelectedEmployeeId(null);
                        }
                    }
                }
            ]
        );
    };

    return (
        <Container>
            {/* 회원 선택*/}
            <TitleText>회원 선택</TitleText>
            <SearchContainer>
                <SearchInput
                    onChangeText={text => setSearchEmployee(text)}
                    placeholder="회원 이름 검색.."
                    value={searchEmployee}
                    returnKeyType='done'
                    onSubmitEditing={_handleEmployeeSearch}
                />
                <MaterialIcons name="search" size={24} color="gray" onPress={_handleEmployeeSearch} />
            </SearchContainer>
            
            <Button title="삭제하기" onPress={_deleteEmployeeButtonPress} />
    
            {/* 모달 */}
            <Modal
                animationType='slide'
                transparent={true}
                visible={isMemberModalVisible}
                onRequestClose={memberToggleModal}
            >
                <SelectionModal
                    list={employees}
                    cancelButtonPress={_memberCancelButtonPress}
                    selectionButtonPress={_memberSelectionButtonPress}
                    selectedUserName={setSelectedEmployeeName}
                />
            </Modal>
        </Container>
    );
};

export default DeleteEmployee;
