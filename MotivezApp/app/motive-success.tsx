// app/motive-success.tsx
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function MotiveSuccessScreen() {
  const router = useRouter();
  const confettiRef = useRef(null);

  return (
    <SafeAreaView style={styles.container}>
      {/* Confetti */}
      <ConfettiCannon
        count={100}
        origin={{ x: -10, y: 0 }}
        fadeOut={true}
        autoStart={true}
        fallSpeed={3000}
        explosionSpeed={350}
      />

      {/* X button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => router.push('/(tabs)/create-motive')}>
        <Ionicons name="close" size={28} color="#333" />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Ionicons name="checkmark-circle-outline" size={80} color="#4CAF50" />
        <Text style={styles.title}>Motive Posted!</Text>
        <Text style={styles.subtitle}>Your motive has been shared successfully.</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/motives')}>
          <Text style={styles.buttonText}>Go to My Motivez</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#f4f6f8',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#e91e63',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
