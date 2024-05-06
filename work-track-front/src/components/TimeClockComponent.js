import React, { useContext, useEffect, useState } from 'react';
import { ProgressContext } from '../contexts';
import { UserContext } from '../contexts';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Alert, Modal } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoteModal from './NoteModal';
import { EmployeeAnnualLeaveByDate } from '../utils/api/apiHandlers';
import Button from './Button';

const Container = styled.View`
    width: 100%;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

const Card = styled.View`
    width: 100%;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 15px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    elevation: 4;
`;

const TitleText = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #333333;

`;

const CheckTimeText = styled.Text`
    font-size: 18px;
    color: ${({ hasCheckTime }) => hasCheckTime ? '#000000' : '#999999'};
    margin-top: 10px;
`;

const CheckTimeButton = styled.TouchableOpacity`
    background-color: #2196F3;
    padding: 12px 40px;
    border-radius: 8px;
    margin-top: 20px;
`;

const ButtonText = styled.Text`
    color: #FFFFFF;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
`;

const NoteButton = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
`;

const NoteButtonText = styled.Text`
    color: #666666;
    font-size: 16px;
    margin-left: 10px;
`;

const ButtonsRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const ErrorText = styled.Text`
    align-items:flex-start;
    width: 100%;
    margin: 5px 0 10px;
    color: ${({ theme }) => theme.errorText};
`;

const SubtitleContainer = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
`;

const SubtitleText = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: #666666;
`;

const TimeClockComponent = ({ navigation }) => {
    const { spinner } = useContext(ProgressContext);
    const { setter, currentUser } = useContext(UserContext);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState('');
    const [checkInTime, setCheckInTime] = useState('');
    const [checkOutTime, setCheckOutTime] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const checkInTime = await AsyncStorage.getItem(`${currentUser.employeeId}_checkInTime`);
                const checkOutTime = await AsyncStorage.getItem(`${currentUser.employeeId}_checkOutTime`)
                const notes = await AsyncStorage.getItem(`${currentUser.employeeId}_notes`);
                setCheckInTime(checkInTime);
                setCheckOutTime(checkOutTime);
                setNotes(notes);

                // 현재 날짜와 {currentUser.employeeId_attendanceDate} 비교한 후 다음 날이면 {currentUser.employeeId_attendanceDate} 값 지움
                const currentDate = getCurrentDate();
                const attendanceDate = await AsyncStorage.getItem(`${currentUser.employeeId}_attendanceDate`);

                if (currentDate !== attendanceDate) {
                    await AsyncStorage.removeItem(`${currentUser.employeeId}_checkInTime`);
                    await AsyncStorage.removeItem(`${currentUser.employeeId}_checkOutTime`);
                    await AsyncStorage.removeItem(`${currentUser.employeeId}_notes`);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // 현재 날짜 포맷
    const getCurrentDate = () => new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short'
    }).replace(/(\d{4})\. (\d{2})\. (\d{2})\./, '$1.$2.$3 ').replace(/ (\w+)\)/, ' ($1)'); 

    // 출근 버튼 클릭
    const handleCheckIn = async () => {
        spinner.start();
        const accessToken = await AsyncStorage.getItem('accessToken');
        const checkInData = {
            employeeId: currentUser.employeeId,
            notes: notes
        };

        try {
            const response = await axios.post("http://192.168.35.131:8080/attendance/check-in", checkInData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setCheckInTime(response.data.checkInTime);
            setNotes(response.data.notes);
            Alert.alert('출근 처리 성공', '출근 처리가 완료되었습니다.');

            await AsyncStorage.setItem(`${currentUser.employeeId}_checkInTime`, response.data.checkInTime);
            await AsyncStorage.setItem(`${currentUser.employeeId}_attendanceDate`, getCurrentDate());
            await AsyncStorage.setItem(`${currentUser.employeeId}_notes`, response.data.notes);
        } catch (error) {
            Alert.alert('출근 처리 실패', `${error.response.data.message}`);
        } finally {
            spinner.stop();
        }
    };

    // 퇴근 버튼 클릭 
    const handleCheckOut = async () => {
        spinner.start();
        const accessToken = await AsyncStorage.getItem('accessToken');
        const checkOutData = {
            employeeId: currentUser.employeeId,
            notes: notes
        };

        try {
            const response = await axios.post("http://192.168.35.131:8080/attendance/check-out", checkOutData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });

            setCheckOutTime(response.data.checkOutTime);
            setNotes(response.data.notes);
            Alert.alert('퇴근 처리 성공', '퇴근 처리가 완료되었습니다.');

            await AsyncStorage.setItem(`${currentUser.employeeId}_checkOutTime`, response.data.checkOutTime);
            await AsyncStorage.setItem(`${currentUser.employeeId}_notes`, response.data.notes);
        } catch (error) {
            Alert.alert('퇴근 처리 실패', `${error.response.data.message}`);
        } finally {
            spinner.stop();
        }
    };

    // 연차 사용 신청 클릭
    const handleAnnualLeave = async () => {
        spinner.start();
        const accessToken = await AsyncStorage.getItem('accessToken');
        const annualData = {
            employeeId: currentUser.employeeId,
            annualLeaveDate: date
        };

        try {
            const response = await axios.post("http://192.168.35.131:8080/annual", annualData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });

            Alert.alert('연차 신청 성공', '연차 신청이 완료되었습니다.');
            await EmployeeAnnualLeaveByDate(currentUser.employeeId, accessToken, currentUser, setter);
        } catch (error) {
            Alert.alert('연차 신청 실패', `${error.response.data.message}`);
        } finally {
            spinner.stop();
            setDate(new Date());
        }
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handleCancelNote = () => {
        setNotes('');
        toggleModal();
    };

    const handleDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setShowDatePicker(false);
            setDate(selectedDate);
        } else {
            setShowDatePicker(false);
        }
    };

    return (
        <Container>
            <Card>
                <TitleText>{getCurrentDate()}</TitleText>

                {/* 출퇴근 버튼 */}
                <ButtonsRow>
                    <CheckTimeButton onPress={handleCheckIn} style={{ backgroundColor: '#4682B4' }}>
                        <ButtonText>출근</ButtonText>
                    </CheckTimeButton>
                    <CheckTimeButton onPress={handleCheckOut} style={{ backgroundColor: '#4682B4' }}>
                        <ButtonText>퇴근</ButtonText>
                    </CheckTimeButton>
                </ButtonsRow>

                {/* 출퇴근 시간 표시 */}
                <CheckTimeText hasCheckTime={Boolean(checkInTime)}>
                    출근 시간: {checkInTime ? checkInTime : '출근하지 않음'}
                </CheckTimeText>
                <CheckTimeText hasCheckTime={Boolean(checkOutTime)}>
                    퇴근 시간: {checkOutTime ? checkOutTime : '퇴근하지 않음'}
                </CheckTimeText>

                {/* 비고란 */}
                <NoteButton onPress={toggleModal}>
                    <MaterialIcons name="edit" size={20} color="#666666" />
                    <NoteButtonText>특이사항 입력</NoteButtonText>
                </NoteButton>
                {notes && (
                    <ErrorText>{`특이사항: ${notes}`}</ErrorText>
                )}

                {/* 연차 사용 */}
                <Button title="연차 사용일 선택" isFilled={false} onPress={() => setShowDatePicker(true)} />
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={toggleModal}
                >
                    <NoteModal
                        onSubmit={toggleModal}
                        onCancel={handleCancelNote}
                        onChangeText={text => setNotes(text)}
                        value={notes}
                    />
                </Modal>
                <Button title="연차 사용 신청" onPress={handleAnnualLeave} />
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                {/* 잔여 연차 개수 표시 */}
                <SubtitleText style={{ marginTop: 10 }}>
                    {`잔여 연차 개수: ${currentUser.annual}일`}
                </SubtitleText>
            </Card>

            {/* 한달 근무시간 조회 */}
            <SubtitleContainer onPress={() => navigation.navigate('Date')}>
                <SubtitleText>한달 근무시간 조회 </SubtitleText>
                <MaterialIcons
                    name="keyboard-arrow-right"
                    size={24}
                    color="#666666"
                />
            </SubtitleContainer>
        </Container>
    );
};

export default TimeClockComponent;
