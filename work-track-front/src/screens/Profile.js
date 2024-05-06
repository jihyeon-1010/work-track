import React, { useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { Button, Image, Input } from '../components';
import { ProgressContext, UserContext } from '../contexts';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
    justify-content: center;
    align-items: center;
    padding: 0 20px;
`;

const Profile = () => {
    const { spinner } = useContext(ProgressContext);
    const { setter } = useContext(UserContext);
    const { currentUser } = useContext(UserContext);
    const [photoUrl, setPhotoUrl] = useState(currentUser.profileUrl + '?timestamp=' + Date.now());

    const theme = useContext(ThemeContext);

    // 로그아웃
    const _handleLogoutButtonPress = async () => {
        try {
            spinner.start();
            const accessToken = await AsyncStorage.getItem('accessToken');

            const response = await axios.post("http://192.168.35.131:8080/customLogout", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (response) {
                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('refreshToken');
                setter.setUser(null);
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            spinner.stop();
        }
    };

    // 프로필 이미지 업데이트
    const _handlePhotoChange = async (profileUrl) => {
        try {
            spinner.start();
            setPhotoUrl(profileUrl);

            const accessToken = await AsyncStorage.getItem('accessToken');

            const base64Data = await loadImageAsBase64(profileUrl);
            
            const updateUser = await axios.put('http://192.168.35.131:8080/updateProfile',
                { profileUrl: base64Data },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            setter.setUser(updateUser.data);
        } catch (error) {
            console.log(error);
        } finally {
            spinner.stop();
        }
    };

    // 이미지를 Base64로 변환
    const loadImageAsBase64 = async (filePath) => {
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

    return (
        <Container>
            <Image
                url={photoUrl}
                onChangeImage={_handlePhotoChange}
                showButton
                rounded
            />

            <Input label="이름" value={currentUser.name} disabled />
            <Input label="이메일" value={currentUser.email} containerStyle={{ marginTop: 15 }} disabled />

            <Button
                title="로그아웃"
                onPress={_handleLogoutButtonPress}
                containerStyle={{ marginTop: 30, backgroundColor: theme.buttonLogout }}
            />
        </Container>
    );
};

export default Profile;
