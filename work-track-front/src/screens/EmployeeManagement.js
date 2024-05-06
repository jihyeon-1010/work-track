import React, { useState } from 'react';
import styled from 'styled-components/native';
import Employee from './Employee';
import DeleteEmployee from './DeleteEmployee';

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
`;

const ButtonRow = styled.View`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 0 20px;
    margin-bottom: 10px;
`;

const SelectionButtonContainer = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    width: 50%;
    height: 50px;
    background-color: ${({ isActive, theme }) => isActive ? theme.buttonBackground : '#fff'};
    border-bottom-width: 2px;
    border-top-width: 1px;
    border-color: ${({theme}) => theme.buttonBackground};
`;

const SelectionButtonText = styled.Text`
    color: ${({ isActive, theme }) => isActive ? theme.buttonTitle : theme.text};
    font-size: 16px;
`;

const EmployeeManagement = () => {
    const [activeButton, setActiveButton] = useState('register');

    return (
        <Container>
            <ButtonRow>
                <SelectionButtonContainer
                    isActive={activeButton === 'register'}
                    onPress={() => setActiveButton('register')}
                >
                    <SelectionButtonText isActive={activeButton === 'register'}>
                        직원 등록
                    </SelectionButtonText>
                </SelectionButtonContainer>

                <SelectionButtonContainer
                    isActive={activeButton === 'delete'} 
                    onPress={() => setActiveButton('delete')}
                >
                    <SelectionButtonText isActive={activeButton === 'delete'}>
                        직원 삭제
                    </SelectionButtonText>
                </SelectionButtonContainer>
            </ButtonRow>

            {activeButton === 'register' ? (
                <Employee /> // 직원 등록 컴포넌트 렌더링
            ) : (
                <DeleteEmployee /> // 직원 삭제 컴포넌트 렌더링
            )}
        </Container>
    );
};

export default EmployeeManagement;
