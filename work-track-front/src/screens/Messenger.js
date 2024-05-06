import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { ThemeContext } from 'styled-components';
import { ProgressContext } from '../contexts/Progress';
import { MaterialIcons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';

const Container = styled.View`
    flex: 1;
    background-color: ${({theme}) => theme.background};
`;

const ItemContainer = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    border-bottom-width: 1px;
    border-color: ${({ theme }) => theme.listBorder};
    padding: 15px 20px;
`;

const ItemTextContainer = styled.View`
    flex: 1;
    flex-direction: column;
`;

const ItemTitle = styled.Text`
    font-size: 20px;
    font-weight: 600;
`;

const ItemDescription = styled.Text`
    font-size: 16px;
    margin-top: 5px;
    color: ${({ theme }) => theme.listTime};
`;

const ItemTime = styled.Text`
    font-size: 12px;
    color: ${({ theme }) => theme.listTime};
`;

const getDateOrTime = ts => {
    const now = moment().startOf('day');
    const target = moment(ts).startOf('day');
    return moment(ts).format(now.diff(target, 'days') > 0 ? 'MM/DD' : 'HH:mm');
};

const Item = React.memo(
    ({ item: { id, title, description, createdAt }, onPress }) => {
        const theme = useContext(ThemeContext);

    return (
        <ItemContainer onPress={() => onPress({ id, title })}>
            <ItemTextContainer>
                <ItemTitle>{title}</ItemTitle>
                <ItemDescription>{description}</ItemDescription>
            </ItemTextContainer>

            <ItemTime>{getDateOrTime(createdAt)}</ItemTime>

            <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={theme.listIcon}
            />
        </ItemContainer>
        );
    }
);

const Messenger = ({ navigation }) => {
    const { spinner } = useContext(ProgressContext);
    const [channels, setChannels] = useState([]);
    
    useEffect(() => {
        _getMessengerRoom();
    }, []);

    // 전체 메신저룸 조회
    const _getMessengerRoom = async () => {
        try {
            spinner.start();
            const accessToken = await AsyncStorage.getItem('accessToken');

            const response = await axios.get("http://192.168.35.131:8080/channel", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // 데이터를 받아와서 시간 순으로 정렬
            const sortedChannels = response.data.sort((a, b) => {
                return moment(b.createdAt).diff(moment(a.createdAt));
            });

            setChannels(sortedChannels);
        }
        catch (error) {
            console.log(error);
        }
        finally {
            spinner.stop();
        }
    };

    // 메신저룸으로 이동
    const _handleItemPress = (params) => {
        navigation.navigate('MessengerRoom', params);
    };

    return (
        <Container>
            <FlatList
                keyExtractor={item => item['id']}
                data={channels}
                renderItem={({ item }) => (
                    <Item item={item} onPress={_handleItemPress} />
                )}
                windowSize={3}
            />
        </Container>
    );
};

export default Messenger;
