import React from 'react';
import styled from 'styled-components/native'; 
import { _getDepartments } from '../utils/api/apiHandlers';

const Container = styled.View`
    flex-direction: row;
    align-items: center;
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
`;

const ProfilePicture = styled.Image`
    border-radius: 20px;
    width: 40px;
    height:40px;
    margin-right: 5%;
    background-color: ${({theme}) => theme.profileImageBackground};
`;

const Info = styled.View`
    flex: 1;
`;

const Name = styled.Text`
    font-size: 16px;
    font-weight: bold;
`;

const Details = styled.Text`
    font-size: 14px;
    color: #666;
`;

const RegistrationButton = styled.TouchableOpacity`
    padding: 5px 10px;
    border-radius: 5px;
    background-color: ${({theme}) => theme.buttonBackground};
    align-items: center;
    justify-content: center;
`;

const ButtonText = styled.Text`
    font-size: 14px;
    font-weight: bold;
    color: ${({theme}) => theme.buttonTitle}
`;

const EmployeeList = ({ member, selectionButtonPress, selectedUserName }) => {  

    return (
        <Container>
            {/* 프로필 이미지 */}
            <ProfilePicture source={{ uri: `${member.user ? member.user.profileUrl : member.profileUrl}?timestamp=${Date.now()}` }} alt="Profile" />

            {/* 회원 정보 */}
            <Info>
                <Name>{member.user ? member.user.name : member.name }</Name>
                <Details>{member.user ? member.user.email : member.email}</Details>
            </Info>
            
            <RegistrationButton
                onPress={() => {
                    const employeeId = member.user ? member.id : member.id;
                    const employeeName = member.user ? member.user.name : member.name;
                    selectionButtonPress(employeeId);
                    selectedUserName(employeeName);
                }}
            >
                <ButtonText>선택</ButtonText>
            </RegistrationButton>
        </Container>
    );
};

export default EmployeeList;
