import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Saved() {
    const router = useRouter();

  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <SafeAreaView style={{ flex: 1, backgroundColor: '#efe7ee' }}>
    <View style={styles.container}>
        {/* Back button to return to previous screen */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={35} color="black" />
        </TouchableOpacity>

        {/* Saved content */}
      <Text style={styles.text}>This is the Calendar page</Text>
    </View>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#efe7ee',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
    backButton: {
    position: 'absolute',
    top: 30,
    left: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
