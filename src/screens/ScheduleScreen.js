import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import CalendarForm from '../components/CalendarForm';
import { fetchScheduleList } from '../api/fetchSchedule';

export default function ScheduleScreen() {
  const [scheduleList, setScheduleList] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        try {
          const data = await fetchScheduleList();
          setScheduleList(data);
          console.log(scheduleList);
        } catch (error) {
          console.error('Error loading data', error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, [])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CalendarForm
        scheduleList={scheduleList}
        setScheduleList={setScheduleList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
