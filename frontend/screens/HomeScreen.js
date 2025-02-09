import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <View>
            <Text>Welcome to Motivez!</Text>
            <Button title="Find a Motive" onPress={() => navigation.navigate('Explore')} />
        </View>
    );
};

export default HomeScreen;
