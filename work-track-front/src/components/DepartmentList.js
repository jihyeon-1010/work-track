import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
    flex-direction: row;
    align-items: center;
    border-bottom-width: 1px;
    border-color: ${({ theme }) => theme.listBorder};    
    background-color: #ffffff;
    padding: 10px 0;
`;

const Info = styled.View`
    flex: 1;
    flex-direction: column;
`;

const InfoTitle = styled.Text`
    font-size: 16px;
    font-weight: bold;
`;

const InfoDescription = styled.Text`
    font-size: 14px;
    color: #666;
`;

const ItemTime = styled.Text`
    font-size: 12px;
    color: ${({ theme }) => theme.listTime};
    margin-right: 4px;
`;

const BoldText = styled.Text`
    font-weight: bold;
`;

const Button = styled.TouchableOpacity`
    background-color: ${({theme}) => theme.buttonBackground};
    padding: 5px 10px;
    border-radius: 5px;
`;

const ButtonText = styled.Text`
    font-size: 14px;
    color: ${({theme}) => theme.buttonTitle};
    font-weight: bold;
`;

const DepartmentList = ({ department, selectionButtonPress, selectedDepartmentName }) => {
    return (
        <Container>
            {/* 해당 부서의 매니저 */}
            <Info>
                <InfoTitle>{department.name}</InfoTitle>
                {department.managerNameList.length != 0 ? (
                    <InfoDescription>{`매니저: ${department.managerNameList}`}</InfoDescription>
                ) : (
                    <InfoDescription>매니저: 미지정</InfoDescription>
                )}
            </Info>

            {/* 총 사원 수 */}
            <ItemTime>총 사원수 <BoldText>{`${department.memberCount}명`}</BoldText></ItemTime>

            <Button onPress={() => {
                selectionButtonPress(department.id)
                selectedDepartmentName(department.name)
                }}
            >
                <ButtonText>선택</ButtonText>
            </Button>
        </Container>
    );
};

export default DepartmentList;
