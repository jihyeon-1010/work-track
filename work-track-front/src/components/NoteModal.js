import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
`;

const ModalBox = styled.View`
    background-color: #ffffff;
    width: 80%;
    padding: 20px;
    border-radius: 10px;
`;

const Input = styled.TextInput`
    background-color: #f0f0f0;
    height: 150px;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 10px;
`;

const ButtonContainer = styled.View`
    flex-direction: row;
    justify-content: space-around;
`;

const CancelButton = styled.TouchableOpacity`
    padding: 10px 20px;
    border-radius: 5px;
    background-color: #e74c3c;
`;

const ConfirmButton = styled.TouchableOpacity`
    padding: 10px 20px;
    border-radius: 5px;
    background-color: #2ecc71;
`;

const ButtonText = styled.Text`
    color: #fff;
    font-weight: bold;
`;

const NoteModal = ({ onSubmit, onChangeText, onCancel, value }) => {
    return (
        <Container>
            <ModalBox>
                <Input
                    placeholder="비고란을 입력하세요"
                    multiline={true}
                    onChangeText={onChangeText}
                    value={value}
                />

                <ButtonContainer>
                    <CancelButton onPress={onCancel}>
                        <ButtonText>취소</ButtonText>
                    </CancelButton>

                    <ConfirmButton onPress={onSubmit}>
                        <ButtonText>확인</ButtonText>
                    </ConfirmButton>
                </ButtonContainer>
            </ModalBox>
        </Container>
    );
};

export default NoteModal;
