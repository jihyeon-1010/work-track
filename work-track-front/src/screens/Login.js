import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProgressContext } from '../contexts/Progress';
import styled from 'styled-components/native';
import { Image, Input, Button } from '../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, removeWhitespace, validatePassword } from '../utils/common';
import { images } from '../utils/images';
import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../contexts';
import { EmployeeAnnualLeaveByDate } from '../utils/api/apiHandlers';

const Container = styled.SafeAreaView`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.background};
    padding: 40px 20px;
`;

const ErrorText = styled.Text`
    align-items:flex-start;
    width: 100%;
    margin: 5px 0 10px;
    color: ${({ theme }) => theme.errorText};
`;

const Login = ({ navigation }) => {
    const { spinner } = useContext(ProgressContext);
    const { setter } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    const [disabled, setDisabled] = useState(true);
    const passwordRef = useRef(); 

    // 이메일 유효성 검사
    const _handleEmailChange = email => {
        const changeEmail = removeWhitespace(email);
        setEmail(changeEmail); 
        setEmailErrorMessage(
            validateEmail(changeEmail) ? '' : '올바른 이메일 형식을 입력해주세요.'
        );
    };

    // 비밀번호 유효성 검사
    const _handlePasswordChange = password => {
        const changePassword = removeWhitespace(password);
        setPassword(changePassword);
        setPasswordErrorMessage(validatePassword(changePassword) ? '' : '비밀번호는 최소 8자에서 16자까지 영문자, 숫자 및 특수 문자를 사용해주세요.');
        
    }

    // 자동 로그인
    const autoLogin = async () => {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken) {
            await authenticateUser(accessToken);
        }
    };

    // 로그인 버튼 
    const _handleLoginButtonPress = async () => {
        spinner.start();

        const login = {
            email: email,
            password: password,
        };

        try {
            const response = await axios.post("http://192.168.35.131:8080/login", login, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // 사용자 인증 요청 보내기
            await authenticateUser(response.data.accessToken);  

            // 로그인 성공 시 AsyncStorage에 토큰 저장
            await AsyncStorage.setItem('accessToken', response.data.accessToken);
            await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
        }
        catch (error) {
            Alert.alert('로그인 실패', `${error.response.data.message}`);
        }
        finally {
            spinner.stop();

            setEmail('');
            setPassword('');
        }
    };

    // 사용자 인증 요청
    const authenticateUser = async (accessToken) => {
        try {
            const response = await axios.get("http://192.168.35.131:8080/authenticate", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // 남은 연차 조회 요청 보내기
            await EmployeeAnnualLeaveByDate(response.data.employeeId, accessToken, response.data, setter);
        }
        catch (error) {
            console.log("사용자 인증 실패:", error);
            Alert.alert('사용자 인증 실패', `${error.response.data.message}`);
        }
    };

    useEffect(() => {
        autoLogin();
    }, []);

    
    useEffect(() => {
        setDisabled(!(email && password && !emailErrorMessage && !passwordErrorMessage));
    }, [email, password, emailErrorMessage, passwordErrorMessage]);

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            extraScrollHeight={20}
        >
            <Container>
                <Image url={images.logo} />

                <Input 
                    label="이메일"
                    value={email}
                    onChangeText={_handleEmailChange}
                    onSubmitEditing={() => passwordRef.current.focus()}
                    placeholder="example@worktrack.com"
                    returnKeyType="next"
                />
                <ErrorText>{emailErrorMessage}</ErrorText>

                <Input
                    ref={passwordRef}
                    label="비밀번호"
                    value={password}
                    onChangeText={_handlePasswordChange}
                    onSubmitEditing={_handleLoginButtonPress}
                    placeholder='숫자, 영문, 특수문자 조합 최소 8자'
                    returnKeyType='done'
                    isPassword
                />
                <ErrorText>{passwordErrorMessage}</ErrorText>

                <Button
                    title={'로그인'}
                    onPress={_handleLoginButtonPress}
                    disabled={disabled}
                />

                <Button
                    title={'회원가입'}
                    onPress={() => navigation.navigate('Signup')}
                    isFilled={false}
                />
            </Container>
        </KeyboardAwareScrollView>
    );
};

export default Login;
