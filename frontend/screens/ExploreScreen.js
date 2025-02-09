import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import ActivityCard from '../components/ActivityCard';
import axios from 'axios';

const ExploreScreen = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/activities')
            .then(response => setActivities(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <View>
            <Text>Explore nearby activities!</Text>
            <FlatList
                data={activities}
                renderItem={({ item }) => <ActivityCard activity={item} />}
                keyExtractor={item => item._id}
            />
        </View>
    );
};

export default ExploreScreen;
