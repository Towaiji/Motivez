import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/ThemeContext';
import { getColors } from '../../lib/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const colors = getColors(theme);

  const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    backButton: { marginRight: 12 },
    title: { fontSize: 20, fontWeight: 'bold', color: colors.text },

    container: {
      paddingVertical: 16,
    },
    sectionHeader: {
      fontSize: 14,
      color: colors.secondary,
      marginTop: 24,
      marginBottom: 8,
      paddingHorizontal: 16,
      fontWeight: '600',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    rowLabel: { marginLeft: 12, fontSize: 16, color: colors.text },
    rowValue: { color: colors.secondary, fontSize: 14 },

    logoutRow: {
      marginTop: 32,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 16 },
  });


  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => console.log('Logged out') },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={colors.icon} />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          {/* Account Section */}
          <Text style={styles.sectionHeader}>Account</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push('../settings/edit-profile')}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="person-outline" size={22} color={colors.icon} />
              <Text style={styles.rowLabel}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>

          {/* Preferences Section */}
          <Text style={styles.sectionHeader}>Preferences</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={22} color={colors.icon} />
              <Text style={styles.rowLabel}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="location-outline" size={22} color={colors.icon} />
              <Text style={styles.rowLabel}>Location Access</Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="moon-outline" size={22} color={colors.icon} />
              <Text style={styles.rowLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
            />
          </View>

          {/* Privacy Section */}
          <Text style={styles.sectionHeader}>Privacy</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push('../settings/privacy')}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="lock-closed-outline" size={22} color={colors.icon} />
              <Text style={styles.rowLabel}>Privacy & Security</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>

          {/* Support Section */}
          <Text style={styles.sectionHeader}>Support</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push('../settings/help')}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="help-circle-outline" size={22} color={colors.icon} />
              <Text style={styles.rowLabel}>Help & Feedback</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.row}
            onPress={() => Alert.alert('App Version', 'Motivez v1.0.0')}
          >
            <View style={styles.rowLeft}>
              <Ionicons name="information-circle-outline" size={22} color={colors.icon} />
              <Text style={styles.rowLabel}>About Motivez</Text>
            </View>
            <Text style={styles.rowValue}>v1.0.0</Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity style={[styles.row, styles.logoutRow]} onPress={handleLogout}>
            <View style={styles.rowLeft}>
              <Ionicons name="log-out-outline" size={22} color={colors.drawerLogoutIcon} />
              <Text style={[styles.rowLabel, { color: colors.drawerLogout }]}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
