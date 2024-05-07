import React from 'react';
import styled from 'styled-components/native';
import { _getDepartments } from '../utils/api/apiHandlers';
import DepartmentList from './DepartmentList';
import EmployeeList from './EmployeeList';

const Container = styled.View`
    height: 100%;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
`;

const ModalBox = styled.View`
    background-color: #fff;
    width: 90%;
    height: 80%;
    padding: 10px;
    border-radius: 10px;
`;

const List = styled.ScrollView`
    width: 100%;
`;

const CancelButton = styled.TouchableOpacity`
    background-color: ${({theme}) => theme.cancleButton};
    padding: 5px 10px;
    border-radius: 5px;
    align-self: center;
    margin-top: 20px;
`;

const CancelButtonText = styled.Text`
    color: #666;
    font-weight: bold;
`;

const SelectionModal = ({ list, cancelButtonPress, selectionButtonPress, selectedUserName, selectedDepartmentName }) => {
    return (
        <Container>
            <ModalBox>
                <List>
                    {list.map(item => (
                        item.memberCount >= 0 ? (
                            // 부서 리스트
                            <DepartmentList 
                                key={item.id}
                                department={item}
                                selectionButtonPress={selectionButtonPress}
                                selectedDepartmentName={selectedDepartmentName}
                            />
                        ) : (
                            // 직원 리스트 
                            <EmployeeList
                                key={item.id}
                                member={item}
                                selectionButtonPress={selectionButtonPress}
                                selectedUserName={selectedUserName}
                            />
                        )
                    ))}
                </List>

                <CancelButton onPress={cancelButtonPress}>
                    <CancelButtonText>취소</CancelButtonText>
                </CancelButton>
            </ModalBox>
        </Container>
    );
};

export default SelectionModal;
