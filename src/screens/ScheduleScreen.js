import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { format } from 'date-fns';
import CalendarComponent from '../components/CalendarComponent';
import ScheduleListComponent from '../components/ScheduleListComponent';
import AddEventModal from '../components/AddEventModal';
import EditEventModal from '../components/EditEventModal';
import {
  fetchScheduleList,
  fetchSaveSchedule,
  fetchUpdateSchedule,
  fetchDeleteSchedule,
} from '../api/fetchSchedule';

export default function ScheduleScreen() {
  const [scheduleList, setScheduleList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({});

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        try {
          const data = await fetchScheduleList();
          setScheduleList(data);
        } catch (error) {
          console.error('Error loading data', error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, [])
  );

  const handleSaveEvent = async event => {
    const newEvent = await fetchSaveSchedule(event);
    setScheduleList(prevList => [...prevList, newEvent]);
    setAddModalVisible(false);
  };

  const handleUpdateEvent = async updateEvent => {
    const updatedEvent = await fetchUpdateSchedule(updateEvent);
    setScheduleList(prevList =>
      prevList.map(event =>
        event.scheduleIdx === updatedEvent.scheduleIdx ? updatedEvent : event
      )
    );
    setEditModalVisible(false);
    setCurrentEvent(null);
  };

  const handleDeleteEvent = async scheduleIdx => {
    await fetchDeleteSchedule(scheduleIdx);
    setScheduleList(prevList =>
      prevList.filter(event => event.scheduleIdx !== scheduleIdx)
    );
    setEditModalVisible(false);
    setCurrentEvent(null);
  };

  const handleEventPress = event => {
    setCurrentEvent(event);
    setEditModalVisible(true);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CalendarComponent
        scheduleList={scheduleList}
        selectedDate={selectedDate}
        onDayPress={day => setSelectedDate(day.dateString)}
      />
      <ScheduleListComponent
        today={false}
        scheduleList={scheduleList}
        selectedDate={selectedDate}
        onEventPress={handleEventPress}
        onAddEvent={() => {
          setCurrentEvent(null);
          setAddModalVisible(true);
        }}
        showModals={true}
      />
      <AddEventModal
        visible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
      />
      <EditEventModal
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleUpdateEvent}
        onDelete={handleDeleteEvent}
        currentEvent={currentEvent}
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
