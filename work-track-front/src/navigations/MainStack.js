import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MessengerRoomCreation, MessengerRoom, DateCalendar } from '../screens';
import MainTab from './MainTab';

const Stack = createStackNavigator();

const MainStack = () => {
    const theme = useContext(ThemeContext);

    return (
        <Stack.Navigator
            initialRouteName='Main'
            screenOptions={{
                headerTitleAlign: 'center',
                headerTintColor: theme.headerTintColor,
                cardStyle: { backgroundColor: theme.backgroundColor },
                headerBackTitleVisible: false,
            }}
        >
            <Stack.Screen
                name='Main'
                component={MainTab}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='MessengerRoom Creation'
                component={MessengerRoomCreation}
                options={{
                    headerTitle: '메신저룸 생성',
                }}
            />
            <Stack.Screen
                name='MessengerRoom'
                component={MessengerRoom}
                options={{
                    headerTitle: '메신저룸',
                }}
            />
            <Stack.Screen
                name='Date'
                component={DateCalendar}
                options={{
                    headerTitle: '근무시간 조회'
                }}
            />
        </Stack.Navigator>
    );
};

export default MainStack;
