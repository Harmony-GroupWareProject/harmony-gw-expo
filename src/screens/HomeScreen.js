import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Text } from 'react-native';
import { format } from 'date-fns';
import ScheduleListComponent from '../components/ScheduleListComponent';
import NoticeListComponent from '../components/NoticeListComponent';
import { fetchScheduleList } from '../api/fetchSchedule';
import { fetchNoticeList } from '../api/fetchNotice';

export default function HomeScreen() {
  const [scheduleList, setScheduleList] = useState([]);
  const [notices, setNotices] = useState([]);
  const selectedDate = format(new Date(), 'yyyy-MM-dd');

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const scheduleData = await fetchScheduleList();
          setScheduleList(scheduleData);

          const noticeData = await fetchNoticeList(0, 5);
          setNotices(noticeData.content);
        } catch (error) {
          console.error('Error loading data', error);
        }
      };

      loadData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <ScheduleListComponent
          today={true}
          scheduleList={scheduleList}
          selectedDate={selectedDate}
          onEventPress={() => {}}
          onAddEvent={() => {}}
          showModals={false}
          showAddButton={false}
        />
      </View>
      <View style={styles.noticeContainer}>
        <Text style={styles.title}>공지사항</Text>
        <NoticeListComponent notices={notices} showPagination={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  calendarContainer: {
    flex: 1,
  },
  noticeContainer: {
    flex: 1,
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#FFF',
    padding: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 0,
  },
});
