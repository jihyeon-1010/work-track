import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { UserContext } from '../contexts';

const Container = styled.View`
    flex-direction: row;
    align-items: center;
    padding: 10px 20px;
    background-color: #fff;
`;

const ProfileImage = styled.Image`
    width: 50px;
    height: 50px;
    border-radius: 25px;
    margin-right: 10px;
    background-color: ${({ theme }) => theme.profileImageBackground};
`;

const InfoContainer = styled.View`
    flex: 1;
    justify-content: center;
`;

const NameText = styled.Text`
    font-size: 16px;
    font-weight: bold; 
    color: #000000;
    margin-bottom: 5px;
`;

const DepartmentText = styled.Text`
    font-size: 14px; 
    color: #000000;
`;

const CustomProfile = () => {
    const { currentUser } = useContext(UserContext);

    return (
        <Container>
            <ProfileImage source={{ uri: `${currentUser.profileUrl}?timestamp=${Date.now()}` }} />
        
            <InfoContainer>
                <NameText>{`${currentUser.name} (${currentUser.auth === 'MANAGER' ? '매니저' : '사원'})`}</NameText>
                <DepartmentText>{currentUser.departmentName}</DepartmentText>
            </InfoContainer>
        </Container>
    );
};

export default CustomProfile;
