import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WorkAttendance, Messenger, Profile, EmployeeManagement, Department } from '../screens';
import { ThemeContext } from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ focused, name }) => {
    const theme = useContext(ThemeContext);

    return (
        <MaterialIcons
            name={name}
            size={26}
            color={focused ? theme.tabActiveColor : theme.tabInactiveColor}
        />
    )
}

const MainTab = ({ navigation, route }) => {
    const theme = useContext(ThemeContext);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                headerTitleAlign: 'center',
                tabBarActiveTintColor: theme.tabActiveColor,
                tabBarInactiveTintColor: theme.tabInactiveColor,
                tabBarStyle: [
                    {
                        display: 'flex',
                    },
                    null,
                ],
            }}
        >
            <Tab.Screen
                name='Work Attendance'
                component={WorkAttendance}
                options={{
                    tabBarIcon: ({ focused }) =>
                        TabBarIcon({
                            focused,
                            name: focused ? 'watch-later' : 'schedule',
                        }),
                    tabBarLabel: '근태 관리',
                    headerTitle: '근태 관리'
                }}
            />
            <Tab.Screen
                name="EmployeeManagement"
                component={EmployeeManagement}
                options={{
                    tabBarIcon: ({ focused }) =>
                        TabBarIcon({
                            focused,
                            name: focused ? 'people' : 'people-outline',
                        }),
                    tabBarLabel: '직원 관리',
                    headerTitle: '직원 관리'
                }}
            />
            <Tab.Screen
                name="Department"
                component={Department}
                options={{
                    tabBarIcon: ({ focused }) =>
                        TabBarIcon({
                            focused,
                            name: focused ? 'bookmark' : 'bookmark-border',
                        }),
                    tabBarLabel: '부서 관리',
                    headerTitle: '부서 관리'
                }}
            />
            <Tab.Screen
                name='Messenger'
                component={Messenger}
                options={{
                    tabBarIcon: ({ focused }) =>
                        TabBarIcon({
                            focused,
                            name: focused ? 'chat-bubble' : 'chat-bubble-outline',
                        }),
                    tabBarLabel: '메신저',
                    headerTitle: '메신저 목록',
                    headerRight: () => (
                        <MaterialIcons
                            name='add'
                            size={26}
                            style={{ marginRight: 10 }}
                            onPress={() => navigation.navigate('MessengerRoom Creation')}
                        />
                    )
                }}
            />
            <Tab.Screen
                name='Profile'
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) =>
                        TabBarIcon({
                            focused,
                            name: focused ? 'person' : 'person-outline',
                        }),
                    tabBarLabel: '프로필',
                    headerTitle: '프로필'
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTab;
