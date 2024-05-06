import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CustomProfile, TimeClockComponent } from '../components';

const Container = styled.SafeAreaView`
    flex: 1;
    align-items: center;
    background-color: #f8f8f8;
`;

const WorkAttendance = ({ navigation }) => {
    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flex: 1 }}
            extraScrollHeight={20}
        >
            <Container>
                <CustomProfile />
                <TimeClockComponent navigation={navigation}/>
            </Container>
        </KeyboardAwareScrollView>
    );
};

export default WorkAttendance;
