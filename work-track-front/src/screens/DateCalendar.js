import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components/native';
import { ScrollView, Text, Button, Alert } from 'react-native';
import { ProgressContext } from '../contexts';
import { UserContext } from '../contexts';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Container = styled.View`
    flex: 1;
    background-color: #f4f4f4;
`;

const CalendarContainer = styled.View`
    flex-grow: 1;
    padding: 20px;
    background-color: #ffffff;
    border-bottom-width: 2px;
    border-color: ${({ theme }) => theme.listBorder};    
`;

const Row = styled(ScrollView).attrs(() => ({
    horizontal: true,
    showsHorizontalScrollIndicator: false
}))`
    flex-direction: row;
    margin-bottom: 10px;
`;

const Day = styled.View`
    width: 70px;
    height: 80px;
    background-color: ${({ isDayOff }) => isDayOff ? '#d5d5d5' : '#e3f2fd'};
    align-items: center;
    justify-content: center;
    margin: 4px;
    border-radius: 10px;
`;

const DayText = styled.Text`
    font-size: 16px; 
    color: ${({ isHoliday, isWeekend, isPreviousMonth, isPreviousMonthWeekend }) => {
        if (isHoliday) return '#FF0000'; // 공휴일인 경우 빨간색
        if (isPreviousMonthWeekend) return 'rgba(255, 140, 0, 0.3)'; // 이전 달의 주말인 경우 흐린 주황색
        if (isWeekend) return '#FFA500'; // 주말인 경우 주황색 
        if (isPreviousMonth) return 'rgba(153, 153, 153, 0.5)'; // 이전 달 날짜인 경우 흐린 색상
        return '#333'; // 그 외에는 기본 색상 
    }};
`;

const HoursText = styled.Text`
    font-size: 14px;
    color: #666;
`;

const Header = styled.View`
    padding: 24px;
    background-color: ${({theme}) => theme.buttonBackground};
    align-items: center;
`;

const WeekLabel = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #333;
    padding-right: 10px;
`;

const DateCalendar = () => {
    const { spinner } = useContext(ProgressContext);
    const { currentUser } = useContext(UserContext);

    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [workingMinutes, setWorkingMinutes] = useState([]);
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    // date picker 모달
    const showDatepicker = () => {
        setShowPicker(true);
    };

    //  YearMonth 타입으로 날짜 포맷팅
    const formatYearMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        return `${year}-${month < 10 ? '0' + month : month}`;
    };

    // 근무 시간 조회
    const fetchWorkingMinutes = async () => {
        spinner.start();
        const accessToken = await AsyncStorage.getItem('accessToken');

        try {
            const response = await axios.get("http://192.168.35.131:8080/attendance/work-minutes", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    employeeId: currentUser.employeeId,
                    yearMonth: formatYearMonth(date)
                }
            });

            setWorkingMinutes(response.data.detail);
        }
        catch (error) {
            Alert.alert('조회 실패', `${error.response.data.message}`);
        }
        finally {
            spinner.stop();
        }
    };

    useEffect(() => {
        fetchWorkingMinutes();
    }, [date]);

    const getStartingDayIndex = (date) => {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        return firstDayOfMonth.getDay(); // 0은 일요일, 1은 월요일, ..., 6은 토요일
    };

    return (
        <Container>
            {/* 해더 */}
            <Header>
                <Button onPress={showDatepicker} title="월 선택" color="#000" />
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 10 }}>{formatYearMonth(date)}</Text>
                {/* 날짜 선택 모달 */}
                {showPicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            if (selectedDate !== undefined && selectedDate !== null) {
                                setDate(selectedDate);
                                setShowPicker(false);
                            }
                        }}
                    />
                )}
            </Header>

            {/* 캘린더 내용 */}
            <ScrollView>
                {Array.from({ length: Math.ceil((daysInMonth + getStartingDayIndex(date)) / 7) }).map((_, row) => (
                    <CalendarContainer key={row}>
                        <WeekLabel>{`${row + 1}주차`}</WeekLabel>
                        <Row>
                            {Array.from({ length: 7 }).map((_, index) => {
                                const dayIndex = row * 7 + index; // 현재 날짜의 인덱스 계산 
                                const day = dayIndex - getStartingDayIndex(date) + 1; // 현재 날자 계산 
                                const workDay = workingMinutes.find(w => new Date(w.date).getDate() === day); 
                                const isHoliday = workDay ? workDay.isHoliday : false; // 현재 날짜가 공휴일인지 확인
                                const isDayOff = workDay ? workDay.usingDayOff : false; // 현재 날짜가 휴일인지 확인
                                const isWeekend = index === 0 || index === 6; // 현재 날짜가 주말인지 확인
                                const isPreviousMonth = day < 1 || day > daysInMonth; // 현재 날짜가 이전 달에 속하는지 학인
                                const isPreviousMonthWeekend = isWeekend && isPreviousMonth; // 이전 달의 주말 여부 확인
            
                                return (
                                    <Day key={index} isDayOff={isDayOff}>
                                        <DayText 
                                            isHoliday={isHoliday}
                                            isWeekend={isWeekend} 
                                            isPreviousMonth={isPreviousMonth}
                                            isPreviousMonthWeekend={isPreviousMonthWeekend}
                                        >
                                            {day < 1 ? new Date(date.getFullYear(), date.getMonth(), 0 - Math.abs(day)).getDate() : day > daysInMonth ? day - daysInMonth : day}
                                        </DayText>
                                        <HoursText style={{ color: isDayOff ? '#FFF' : '#666' }}>{workDay ? (isDayOff ? '연차 사용' : `${workDay.workingMinutes} mins`) : '0 mins'}</HoursText>
                                    </Day>
                                );
                            })}
                        </Row>
                    </CalendarContainer>
                ))}
            </ScrollView>
        </Container>
    );
};

export default DateCalendar;
