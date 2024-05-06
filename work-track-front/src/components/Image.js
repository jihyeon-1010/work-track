import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import { Permissions } from 'expo-permissions';

const Container = styled.View`
    align-self: center;
    margin-bottom: 30px;
`;

const StyledImage = styled.Image`
    background-color: ${({ theme, rounded }) => rounded ? theme.profileImageBackground : theme.imageBackground};
    width: 100px;
    height: 100px;
    border-radius: ${({ rounded }) => (rounded ? 50 : 8)}px;
`;

const ButtonContainer = styled.TouchableOpacity`
    background-color: ${({ theme }) => theme.imageButtonBackground};
    position: absolute;
    bottom: 0;
    right: 0;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    justify-content: center;
    align-items: center;
`;

const ButtonIcon = styled(MaterialIcons).attrs({
    name: 'photo-camera',
    size: 22,
})`
    color: ${({ theme }) => theme.imageButtonIcon};
`;

const PhotoButton = ({ onPress }) => {
    return (
        <ButtonContainer onPress={onPress}>
            <ButtonIcon />
        </ButtonContainer>
    )
}

const Image = ({ url, rounded, showButton, onChangeImage }) => {
    // ios에서 사진첩에 접근하기 위한 권한 요청
    useEffect(() => {
        (async () => {
            try {
                if (Platform.OS === 'ios') {
                    const { status } = await Permissions.askAsync(
                        Permissions.CAMERA_ROLL
                    );
                    if (status !== 'granted') {
                        Alert.alert(
                            '사진 권한 요청',
                            '카메라 권한을 허용해주세요.'
                        );
                    }
                }
            } catch (e) {
                // 권한 요청 중 오류가 발생한 경우, 사용자에게 알림창 표시
                Alert.alert('권한 오류', e.message);
            }
        })();
    }, []);

    // 이미지 편집 버튼 클릭 시
    const _handleEditButton = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                // 이미지로 타입 제한
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                // 이미지 편집 허용
                allowsEditing: true,
                // 이미지 비율
                aspect: [1, 1],
                // 이미지 품질 (0~1): 1은 최상의 품질
                quality: 1,
            });
            if (!result.canceled) {
                onChangeImage(result.assets[0].uri);
            }
        } catch (e) {
            Alert.alert('사진 오류', e.message);
        }
    };

    return (
        <Container>
            <StyledImage source={{ uri: url }} rounded={rounded} />
            {showButton && <PhotoButton onPress={_handleEditButton} />}
        </Container>
    );
};

Image.defaultProps = {
    rounded: false,
    showButton: false,
    onChangeImage: () => {},
};

Image.propTypes = {
    url: PropTypes.string,
    imageStyle: PropTypes.object,
    rounded: PropTypes.bool,
    showButton: PropTypes.bool,
    onChangeImage: PropTypes.func,
};

export default Image;
