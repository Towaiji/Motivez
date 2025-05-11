import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import CardSwiper from '../../components/CardSwiper'; // adjust path if needed

export default function Home() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.header}>Welcome to Motivez!</Text>
        <Text style={styles.subtext}>What do you feel like doing today?</Text>
        
        <View style={styles.swiperContainer}>
          <CardSwiper />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#efe7ee',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#efe7ee',
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  swiperContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});