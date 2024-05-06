import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

const TRANSPARENT = 'transparent';

const Container = styled.TouchableOpacity`
    background-color: ${({ theme, isFilled }) => isFilled ? theme.buttonBackground : TRANSPARENT};
    align-items: center;
    border-radius: 4px;
    width: 40%;
    padding: 5px 10px;
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
    margin-top: 10px;

`;

const Title = styled.Text`
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    color: ${({ theme, isFilled }) => isFilled ? theme.buttonTitle : theme.buttonUnfilledTitle};
`;

const SmallButton = ({ containerStyle, title, onPress, isFilled }) => {
    return (
        <Container
            style={containerStyle}
            onPress={onPress}
            isFilled={isFilled}
        >
            <Title isFilled={isFilled}>{title}</Title>
        </Container>
    );
};

SmallButton.defaultProps = {
    isFilled: true,
};

SmallButton.propTypes = {
    containerStyle: PropTypes.object,
    title: PropTypes.string,
    onPress: PropTypes.func.isRequired,
    isFilled: PropTypes.bool,
};

export default SmallButton;
