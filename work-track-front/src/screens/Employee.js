import React, { useContext, useState } from 'react';
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
`;

const List = styled.ScrollView`
    width: 100%;
    flex: 1;
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

const Employee = () => {
    const { spinner } = useContext(ProgressContext);

    const [searchMember, setSearchMember] = useState('');
    const [departments, setDepartments] = useState([]);
    const [members, setMembers] = useState([]);

    const [selectedUserName, setSelectedUserName] = useState(null);
    const [selectedDepartmentName, setSelectedDepartmentName] = useState(null);

    const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);
    const [isDepartmentModalVisible, setIsDepartmentModalVisible] = useState(false);
    const [showWorkStartDatePicker, setShowWorkStartDatePicker] = useState(false);
    const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);

    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
    const [workStartDate, setWorkStartDate] = useState(new Date());
    const [birthday, setBirthday] = useState(new Date());

    // 부서 전체 조회 
    const _getDepartmentsButtonPress = async () => {
        try {
            spinner.start();
            const fetchedDepartments = await _getDepartments();
            console.log(fetchedDepartments);
            
            setDepartments(fetchedDepartments);
            departmentToggleModal();
        } catch (error) {
            console.log(error);
        } finally {
            spinner.stop();
        }
    };

    // 회원 조회
    const _handleMemberSearch = async () => {
        spinner.start();
        const accessToken = await AsyncStorage.getItem('accessToken');

        try {
            const response = await axios.get("http://192.168.35.131:8080/user", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    query: searchMember
                }
            });

            setMembers(response.data);
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

    //직원 등록
    const _registerEmployeeButtonPress = async () => {
        Alert.alert(
            '직원 등록',
            `${selectedUserName}, \n${selectedDepartmentName}, \n입사일자(${formatDate(workStartDate)}), \n생년월일(${formatDate(birthday)}) \n직원 등록하시겠습니까?`,
            [
                {
                    text: '취소',
                    style: 'cancel',
                },
                {
                    text: '확인',
                    onPress: async () => {
                        try {
                            spinner.start();
                            const accessToken = await AsyncStorage.getItem('accessToken');

                            const employee = {
                                userId: selectedUserId,
                                departmentId: selectedDepartmentId,
                                workStartDate: workStartDate,
                                birthday: birthday
                            };

                            const response = await axios.post("http://192.168.35.131:8080/employee", employee, {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                    'Content-Type': 'application/json'
                                }
                            });

                            Alert.alert('직원 등록 성공', '직원 등록이 완료되었습니다.');
                        }
                        catch (error) {
                            Alert.alert('직원 등록 실패', `${error.response.data.message}`);
                        }
                        finally {
                            spinner.stop();
                            setSelectedUserId(null);
                            setSelectedUserName(null);
                            setSelectedDepartmentId(null);
                            setSelectedDepartmentName(null);
                            setWorkStartDate(new Date());
                            setBirthday(new Date());
                        }
                    }
                }
            ]
        );
    };

    // 날짜 포맷 
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // ---------------- 멤버 모달 ----------------
    const memberToggleModal = () => {
        setIsMemberModalVisible(!isMemberModalVisible);
    };  

    const _memberCancelButtonPress = () => {
        setSelectedUserId(null);
        memberToggleModal();
    }; 

    const _memberSelectionButtonPress = (memberId) => {
        setSelectedUserId(memberId);
        memberToggleModal();
    } 

    // ---------------- 부서 모달 ----------------
    const departmentToggleModal = () => {
        setIsDepartmentModalVisible(!isDepartmentModalVisible);
    };  

    const _departmentCancelButtonPress = () => {
        setSelectedDepartmentId(null);
        departmentToggleModal();
    }; 

    const _departmentSelectionButtonPress = (departmentId) => {
        setSelectedDepartmentId(departmentId);
        departmentToggleModal();
    };

    const _showWorkStartDatePicker = () => {
        setShowWorkStartDatePicker(true);
    };

    const _showBirthdayPicker = () => {
        setShowBirthdayPicker(true);
    };

    return (
        <Container>
            <List>
                {/* 회원 선택 */}
                <SectionContainer>
                    <TitleText>회원 선택</TitleText>
                    <InputContainer>
                        <MaterialIcons name="search" size={24} color="gray" />
                        <SearchInput
                            onChangeText={text => setSearchMember(text)}
                            placeholder="회원 이름 검색.."
                            value={searchMember}
                            returnKeyType='done'
                            onSubmitEditing={_handleMemberSearch}
                        />
                    </InputContainer>
                    <Button title="검색" onPress={_handleMemberSearch} />
                </SectionContainer>

                {/* 부서 선택 */}
                <SectionContainer>
                    <TitleText>부서 선택</TitleText>
                    <Button title="부서 선택" onPress={_getDepartmentsButtonPress} />
                </SectionContainer>

                {/* 입사 일자 선택 */}
                <SectionContainer>
                    <TitleText>입사 일자 선택</TitleText>
                    <Button title="입사 일자 선택" onPress={_showWorkStartDatePicker} />
                    {showWorkStartDatePicker && (
                        <DateTimePicker
                            value={workStartDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                if (selectedDate !== undefined && selectedDate !== null) {
                                    setWorkStartDate(selectedDate);
                                    setShowWorkStartDatePicker(false);
                                }
                            }}
                        />
                    )}
                </SectionContainer>

                {/* 생년월일 선택 */}
                <SectionContainer>
                    <TitleText>생년월일 선택</TitleText>
                    <Button title="생년월일 선택" onPress={_showBirthdayPicker} />
                    {showBirthdayPicker && (
                        <DateTimePicker
                            value={birthday}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                if (selectedDate !== undefined && selectedDate !== null) {
                                    setBirthday(selectedDate);
                                    setShowBirthdayPicker(false);
                                }
                            }}
                        />
                    )}
                </SectionContainer>

                {/* 직원 등록 버튼 */}
                <ButtonContainer>
                    <Button title="직원 등록" onPress={_registerEmployeeButtonPress} />
                </ButtonContainer>

                {/* 모달 */}
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={isMemberModalVisible}
                    onRequestClose={memberToggleModal}
                >
                    <SelectionModal
                        list={members}
                        cancelButtonPress={_memberCancelButtonPress}
                        selectionButtonPress={_memberSelectionButtonPress}
                        selectedUserName={setSelectedUserName}
                    />
                </Modal>

                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={isDepartmentModalVisible}
                    onRequestClose={departmentToggleModal}
                >
                    <SelectionModal
                        list={departments}
                        cancelButtonPress={_departmentCancelButtonPress}
                        selectionButtonPress={_departmentSelectionButtonPress}
                        selectedDepartmentName={setSelectedDepartmentName}
                    />
                </Modal>
            </List>
        </Container>
    );
};

export default Employee;
