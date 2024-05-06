import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProgressContext } from '../contexts/Progress';
import styled from 'styled-components/native';
import { Image, Input, Button, RadioGroup } from '../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, removeWhitespace, validatePassword } from '../utils/common';
import axios from 'axios';
import { images } from '../utils/images';
import { Alert } from 'react-native';

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
    color: ${({theme}) => theme.errorText};
`

const Signup = ({ navigation }) => {
    const { spinner } = useContext(ProgressContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [photoUrl, setPhotoUrl] = useState(images.profileImg);

    const [nameErrorMessage, setNameErrorMessage] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] = useState('');
    const [auth, setAuth] = useState('employee');

    const [disabled, setDisabled] = useState(true);

    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    const _handleNameChange = name => {
        setName(name);
        setNameErrorMessage(name ? '' : '반드시 입력해야 하는 필수 사항입니다.');
    };

    const _handleEmailChange = email => {
        setEmail(removeWhitespace(email));
        setEmailErrorMessage(validateEmail(email) ? '' : '올바르지 않은 이메일 형식입니다. 이메일을 다시 확인해주세요.');
    };

    const _handlePasswordChange = password => {
        setPassword(removeWhitespace(password));
        setPasswordErrorMessage(validatePassword(password) ? '' : '비밀번호는 최소 8자에서 16자까지 영문자, 숫자 및 특수 문자를 사용해주세요.');
    };

    const _handlePasswordConfirmChange = passwordConfirm => {
        setPasswordConfirm(removeWhitespace(passwordConfirm));
        setPasswordConfirmErrorMessage(password === passwordConfirm ? '' : '비밀번호가 일치하지 않습니다.');
    };

    // 버튼 활성화 여부
    useEffect(() => {
        setDisabled(
            !(name && email && password && passwordConfirm && !nameErrorMessage && !emailErrorMessage && !passwordErrorMessage && !passwordConfirmErrorMessage)
        );
    }, [name, email, password, passwordConfirm, nameErrorMessage, emailErrorMessage, passwordErrorMessage, passwordConfirmErrorMessage]);

    // 회원가입 버튼 
    const _handleSignupButtonPress = async () => {
        spinner.start();

        const base64Data = await loadImageAsBase64(photoUrl);

        const signup = {
            name: name,
            email: email,
            password: password,
            profileImg: base64Data, 
            auth: auth
        };

        try {
            const response = await axios.post('http://192.168.35.131:8080/user', signup, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            Alert.alert('회원가입 성공', '회원가입에 성공했습니다.');

            // 회원가입 성공 후 로그인 페이지로 이동
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('회원가입 실패',
                `${error.response.data.message}`
            );
        } finally {
            spinner.stop();

            setName('');
            setEmail('');
            setPassword('');
            setPasswordConfirm('');
            setPhotoUrl(images.profileImg);
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
        <KeyboardAwareScrollView extraScrollHeight={20}>
            <Container>
                {/* 프로필 이미지 업로드 */}
                <Image
                    rounded
                    url={photoUrl}
                    showButton
                    onChangeImage={url => setPhotoUrl(url)}
                />

                {/* 이름 입력 */}
                <Input
                    label='이름'
                    value={name}
                    onChangeText={_handleNameChange}
                    onSubmitEditing={() => {
                        setName(name.trim());
                        emailRef.current.focus();
                    }}
                    onBlur={() => setName(name.trim())}
                    placeholder='이름을 입력해주세요'
                    returnKeyType='next'
                />
                <ErrorText>{nameErrorMessage}</ErrorText>

                {/* 이메일 입력 */}
                <Input
                    ref={emailRef}
                    label='이메일'
                    value={email}
                    onChangeText={_handleEmailChange}
                    onSubmitEditing={() => passwordRef.current.focus()}
                    placeholder='example@naver.com'
                    returnKeyType='next'
                />
                <ErrorText>{emailErrorMessage}</ErrorText>

                {/* 비밀번호 입력 */}
                <Input
                    ref={passwordRef}
                    label='비밀번호'
                    value={password}
                    onChangeText={_handlePasswordChange}
                    onSubmitEditing={() => passwordConfirmRef.current.focus()}
                    placeholder='비밀번호 입력'
                    returnKeyType='next'
                    isPassword
                />
                <ErrorText>{passwordErrorMessage}</ErrorText>

                {/* 비밀번호 확인 입력 */}
                <Input
                    ref={passwordConfirmRef}
                    label='비밀번호 확인'
                    value={passwordConfirm}
                    onChangeText={_handlePasswordConfirmChange}
                    placeholder='비밀번호 재입력'
                    returnKeyType='next'
                    isPassword
                />
                <ErrorText>{passwordConfirmErrorMessage}</ErrorText>

                {/* 직급 선택 */}
                <RadioGroup
                    label='직급'
                    isLabel
                    value="employee"
                    status={auth === 'employee' ? 'checked' : 'unchecked'}
                    onPress={() => setAuth('employee')}
                    text="사원"
                />
                <RadioGroup
                    value="manager"
                    status={auth === 'manager' ? 'checked' : 'unchecked'}
                    onPress={() => setAuth('manager')}
                    text="매니저"
                />

                <Button
                    title='회원가입'
                    onPress={_handleSignupButtonPress}
                    disabled={disabled}
                    containerStyle={{ marginTop: 15 }}
                />
            </Container>
        </KeyboardAwareScrollView>
    );
};

export default Signup;
