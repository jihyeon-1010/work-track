import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ----------------------------- 잔여 연차 조회 API -----------------------------
export const EmployeeAnnualLeaveByDate = async (employeeId, accessToken, currentUser, setter) => {
    try {
        const response = await axios.get("http://192.168.35.131:8080/annual", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                employeeId: employeeId
            }
        });

        const newCurrentUser = { ...currentUser, annual: response.data.remainingLeaves };
        setter.setUser(newCurrentUser);
    }
    catch (error) {
        console.log("잔여 연차 조회 실패:", error);
        Alert.alert('잔여 연차 조회 실패', `${error.response.data.message}`);
    }
};

// ----------------------------- 부서 전체 조회 -----------------------------
export const _getDepartments = async () => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');

        const response = await axios.get("http://192.168.35.131:8080/department", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}; 

// ----------------------------- 이미지를 Base64로 변환 -----------------------------
export const loadImageAsBase64 = async (filePath) => {
    if (filePath.startsWith('https')) {
        return filePath;
    }
    try {
        const response = await fetch(filePath);
        const blob = await response.blob();
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                const base64Data = reader.result.split(',')[1];
                resolve(base64Data);
            };
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('이미지를 Base64로 변환하는 중 오류 발생: ', error);
        throw new Error('이미지를 Base64로 변환하는 중 오류 발생');
    }
};



