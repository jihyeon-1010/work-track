import React, { useState, forwardRef } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

const Container = styled.View`
    flex-direction: column;
    width: 100%;
`;

const Label = styled.Text`
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 6px;
    color: ${({theme, isFocused}) => (isFocused ? theme.text : theme.label)};
`;

const StyledTextInput = styled.TextInput.attrs(({ theme }) => ({
    placeholderTextColor: theme.inputPlaceholder,
}))`
    background-color: ${({ theme, editable }) =>
        editable ? theme.background : theme.inputDisabledBackground};
    color: ${({ theme }) => theme.text};
    padding: 10px;
    font-size: 16px;
    border: 2px solid ${({ theme, isFocused }) => (isFocused ? theme.main : theme.inputBorder)};
    border-radius: 4px;
`;

const Input = forwardRef(
    (
        {
            label,
            value,
            onChangeText,
            onSubmitEditing,
            onBlur,
            placeholder,
            isPassword,
            returnKeyType,
            maxLength,
            disabled,
            containerStyle,
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);

        return (
            <Container style={containerStyle}>
                <Label isFocused={isFocused}>{label}</Label>
                <StyledTextInput
                    ref={ref}
                    isFocused={isFocused}
                    value={value}
                    onChangeText={onChangeText}
                    onSubmitEditing={onSubmitEditing}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
                        onBlur();
                    }}
                    placeholder={placeholder}
                    secureTextEntry={isPassword}
                    returnKeyType={returnKeyType}
                    maxLength={maxLength}
                    autoCapitalize='none'
                    autoCorrect={false}
                    textContentType='none'
                    underlineColorAndroid='transparent'
                    editable={!disabled}
                />
            </Container>
        );
    }
);

Input.defaultProps = {
    onBlur: () => { },
    onChangeText: () => { },
    onSubmitEditing: () => {},
};

Input.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChangeText: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    onBlur: PropTypes.func,
    placeholder: PropTypes.string,
    isPassword: PropTypes.bool,
    returnKeyType: PropTypes.oneOf(['done', 'next']),
    maxLength: PropTypes.number,
    disabled: PropTypes.bool,
};

export default Input;
