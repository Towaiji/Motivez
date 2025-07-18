import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { supabase } from '../../lib/supabaseClient';

interface MotiveItem {
  id: string;
  title: string;
  time: string;
  rawTime: string;
}

export default function CalendarScreen() {
  const router = useRouter();
  const [motivesByDate, setMotivesByDate] = useState<Record<string, MotiveItem[]>>({});
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    const fetchMotives = async () => {
      const { data, error } = await supabase
        .from('motives')
        .select('id, title, start_time')
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Motives fetch error:', error);
        return;
      }

      const grouped: Record<string, MotiveItem[]> = {};

      data?.forEach((motive) => {
        if (!motive.start_time) return;

        const timeObj = new Date(motive.start_time);
        const date = timeObj.toISOString().split('T')[0];
        const time = timeObj.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        if (!grouped[date]) grouped[date] = [];
        grouped[date].push({
          id: motive.id,
          title: motive.title,
          time,
          rawTime: motive.start_time,
        });
      });

      for (const date in grouped) {
        grouped[date].sort((a, b) => new Date(a.rawTime).getTime() - new Date(b.rawTime).getTime());
      }

      console.log('Grouped motives:', grouped);

      setMotivesByDate(grouped);

      const today = new Date().toISOString().split('T')[0];
      const allDates = Object.keys(grouped);
      setSelected(allDates.includes(today) ? today : allDates[0] || '');
    };

    fetchMotives();
  }, []);

  const markedDates = Object.keys(motivesByDate).reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: '#007AFF',
      selected: date === selected,
      selectedColor: '#e91e63',
    };
    return acc;
  }, {} as Record<string, any>);

  const motives = motivesByDate[selected] || [];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Calendar</Text>
          <View style={{ width: 32 }} />
        </View>

        <Calendar
          markedDates={markedDates}
          onDayPress={(day: { dateString: string }) => setSelected(day.dateString)}
          theme={{
            backgroundColor: '#f4f6f8',
            calendarBackground: '#fff',
            textSectionTitleColor: '#222',
            selectedDayBackgroundColor: '#e91e63',
            selectedDayTextColor: '#fff',
            todayTextColor: '#007AFF',
            dayTextColor: '#222',
            dotColor: '#007AFF',
            arrowColor: '#e91e63',
            monthTextColor: '#333',
            indicatorColor: '#e91e63',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
          }}
          style={styles.calendar}
        />

        <View style={styles.motiveList}>
          <Text style={styles.subheading}>
            {motives.length > 0
              ? `Motivez on ${selected}:`
              : `No motives planned on ${selected}`}
          </Text>
          <FlatList
            data={motives}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.motiveItem}>
                <Ionicons name="calendar-outline" size={22} color="#007AFF" style={{ marginRight: 10 }} />
                <Text style={styles.motiveTitle}>{item.title}</Text>
                <Text style={styles.motiveTime}>@ {item.time}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>—</Text>}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  backButton: {
    width: 32,
    alignItems: 'flex-start',
  },
  topTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  calendar: {
    borderRadius: 12,
    margin: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  motiveList: {
    flex: 1,
    padding: 16,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 10,
    marginLeft: 4,
  },
  motiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  motiveTitle: {
    fontWeight: '600',
    fontSize: 15,
    color: '#222',
    marginRight: 12,
  },
  motiveTime: {
    color: '#888',
    fontSize: 14,
  },
  empty: {
    color: '#aaa',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
