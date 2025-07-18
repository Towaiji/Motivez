import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useAuth } from '../_layout';
import { supabase } from '../../lib/supabaseClient';
import { useTheme } from '../../lib/ThemeContext';
import { getColors } from '../../lib/colors';

export default function EditProfile() {
  const router = useRouter();
  const { profile, setProfile } = useAuth();
  const [name, setName] = useState(profile?.name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const colors = getColors(theme);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, padding: 16 },
    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    backButton: { marginRight: 12 },
    title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
    label: { fontSize: 14, color: colors.text, marginBottom: 4, marginTop: 12 },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
      backgroundColor: colors.inputBackground,
    },
    saveButton: {
      marginTop: 24,
      backgroundColor: colors.primaryPink,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  });

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .update({ name, username, bio })
      .eq('id', profile.id)
      .select()
      .single();
    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    setProfile(data);
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={{ color: colors.primaryBlue }}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
        </View>
        <Text style={styles.label}>Name</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} />
        <Text style={styles.label}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />
        <Text style={styles.label}>Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          style={[styles.input, { height: 80 }]}
          multiline
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}
