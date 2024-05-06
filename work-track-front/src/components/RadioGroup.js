import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { RadioButton } from 'react-native-paper';

const Container = styled.View`
    flex-direction: column;
    width: 100%;
`;

const Label = styled.Text`
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 6px;
    color: ${({theme}) => theme.text};
`;

const Text = styled.Text`
    font-size: 16px;
`;

const RowContainer = styled.View`
    flex-direction: row;
    align-items: center;
`;

const RadioButtonWrapper = styled.View`
    margin-right: 3px; 
`;

const RadioGroup = ({ label, isLabel, value, status, onPress, text }) => {
    const theme = useContext(ThemeContext);
    const radioButtonColor = status === 'checked' ? theme.checkedButton : theme.uncheckedButton;

    return (
        <Container>
            {isLabel && <Label>{label}</Label>}
                <RowContainer>
                    <RadioButtonWrapper>
                        <RadioButton
                            value={value}
                            status={status}
                            onPress={onPress}
                            color={radioButtonColor}
                        />
                    </RadioButtonWrapper>
                    <Text>{text}</Text>
                </RowContainer>
        </Container>
    );
};

export default RadioGroup;
