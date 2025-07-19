import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useAuth } from '../_layout';

interface RequestProfile {
    id: string;
    name: string | null;
    username: string | null;
}

export default function FriendRequestsScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const [incoming, setIncoming] = useState<RequestProfile[]>([]);
    const [outgoing, setOutgoing] = useState<RequestProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchFriendRequests();
    }, [user]);

    async function fetchFriendRequests() {
        setLoading(true);

        // Fetch raw requests
        const { data: requests, error } = await supabase
            .from('friend_requests')
            .select('*')
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .eq('status', 'pending');

        if (error) {
            console.error('Error fetching requests:', error);
            setLoading(false);
            return;
        }

        const incomingReqs = requests?.filter(r => r.receiver_id === user.id) || [];
        const outgoingReqs = requests?.filter(r => r.sender_id === user.id) || [];

        const incomingProfiles: RequestProfile[] = [];
        const outgoingProfiles: RequestProfile[] = [];

        for (const req of incomingReqs) {
            const { data } = await supabase
                .from('profiles')
                .select('id, name, username')
                .eq('id', req.sender_id)
                .single();
            if (data) incomingProfiles.push(data);
        }

        for (const req of outgoingReqs) {
            const { data } = await supabase
                .from('profiles')
                .select('id, name, username')
                .eq('id', req.receiver_id)
                .single();
            if (data) outgoingProfiles.push(data);
        }

        setIncoming(incomingProfiles);
        setOutgoing(outgoingProfiles);
        setLoading(false);
    }

    async function acceptRequest(senderId: string) {
        const { error: insertError } = await supabase
            .from('friendships')
            .insert([
                {
                    user1_id: senderId,
                    user2_id: user?.id,
                },
            ]);

        if (insertError) {
            console.error('Error creating friendship:', insertError);
            return;
        }

        const { error: deleteError } = await supabase
            .from('friend_requests')
            .delete()
            .match({ sender_id: senderId, receiver_id: user?.id });

        if (deleteError) {
            console.error('Error deleting request:', deleteError);
            return;
        }

        // Refresh requests
        fetchFriendRequests();
    }

    async function rejectRequest(senderId: string) {
        const { error } = await supabase
            .from('friend_requests')
            .delete()
            .match({ sender_id: senderId, receiver_id: user?.id });

        if (error) {
            console.error('Error rejecting request:', error);
            return;
        }

        // Refresh requests
        fetchFriendRequests();
    }


    const renderRequest = ({ item }: { item: RequestProfile }) => (
        <View style={styles.card}>
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.username}>@{item.username}</Text>
            </View>
            <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => acceptRequest(item.id)}
            >
                <Ionicons name="checkmark" size={22} color="#4CAF50" />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.declineBtn}
                onPress={() => rejectRequest(item.id)}
            >
                <Ionicons name="close" size={22} color="#F44336" />
            </TouchableOpacity>
        </View>
    );


    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={28} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Friend Requests</Text>
                    <View style={{ width: 28 }} />
                </View>

                {loading ? (
                    <ActivityIndicator size="large" style={{ marginTop: 40 }} />
                ) : (
                    <FlatList
                        ListHeaderComponent={
                            <>
                                {incoming.length > 0 && <Text style={styles.sectionTitle}>Incoming</Text>}
                            </>
                        }
                        data={incoming}
                        keyExtractor={(item) => item.id}
                        renderItem={renderRequest}
                        ListFooterComponent={
                            <>
                                {outgoing.length > 0 && <Text style={styles.sectionTitle}>Sent</Text>}
                                <FlatList
                                    data={outgoing}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderRequest}
                                />
                            </>
                        }
                        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10 }}
                    />
                )}
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f4f6f8' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    title: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '600', color: '#333' },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#555',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    username: {
        fontSize: 14,
        color: '#777',
    },
    acceptBtn: {
        padding: 6,
        marginRight: 4,
    },
    declineBtn: {
        padding: 6,
    },
});
