import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Spinner } from '../components';
import { ProgressContext } from '../contexts/Progress';
import MainStack from './MainStack';
import AuthStack from './AuthStack';
import { UserContext } from '../contexts';

const Navigation = () => {
    const { inProgress } = useContext(ProgressContext);
    const { currentUser } = useContext(UserContext);

    return (
        <NavigationContainer>
            {currentUser ? <MainStack /> : <AuthStack />}
            {inProgress && <Spinner />}
        </NavigationContainer>
    );
};

export default Navigation;
