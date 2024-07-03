import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import PropTypes from 'prop-types';
import {
  startOfDay,
  endOfDay,
  addDays,
  format,
  isWithinInterval,
  differenceInDays,
  parseISO,
} from 'date-fns';
import randomColor from 'randomcolor';
import AddEventModal from './AddEventModal'; // Import the AddEventModal component
import EditEventModal from './EditEventModal'; // Import the EditEventModal component
import {
  fetchSaveSchedule,
  fetchUpdateSchedule,
  fetchDeleteSchedule,
} from '../api/fetchSchedule';

const convertToMarkedDates = data => {
  const initialValue = {};
  const emptyPeriod = { color: 'transparent' };

  return (
    data
      ?.sort((a, b) => {
        const aStart = startOfDay(parseISO(a.start));
        const aEnd = endOfDay(parseISO(a.end));
        const bStart = startOfDay(parseISO(b.start));
        const bEnd = endOfDay(parseISO(b.end));
        return differenceInDays(bEnd, bStart) - differenceInDays(aEnd, aStart);
      })
      .reduce((prev, curr) => {
        const color = randomColor({ seed: curr.scheduleIdx });
        const start = startOfDay(parseISO(curr.start));
        const end = endOfDay(parseISO(curr.end));
        const totalDays = differenceInDays(end, start) + 1;

        let rowIndex = 0;
        let freeRowFound = false;
        while (!freeRowFound) {
          freeRowFound = true;
          for (let i = 0; i < totalDays; i++) {
            const date = addDays(start, i);
            const dateStr = format(date, 'yyyy-MM-dd');

            const period = prev[dateStr]?.periods?.[rowIndex];
            if (period) {
              if (isWithinInterval(date, { start, end })) {
                rowIndex++;
                freeRowFound = false;
                break;
              }
            }
          }
        }

        for (let i = 0; i < totalDays; i++) {
          const date = addDays(start, i);
          const dateStr = format(date, 'yyyy-MM-dd');

          let marking = prev[dateStr];
          if (marking === undefined) {
            marking = {};
          }

          if (marking.periods === undefined) {
            marking.periods = [];
          }

          if (marking.periods.length <= rowIndex) {
            marking.periods = marking.periods.concat(
              [...Array(rowIndex + 1 - marking.periods.length)].map(() => ({
                ...emptyPeriod,
              }))
            );
          }

          marking.periods[rowIndex] = {
            color: color,
            startingDay: i === 0,
            endingDay: i === totalDays - 1,
          };

          prev[dateStr] = marking;
        }

        return prev;
      }, initialValue) ?? initialValue
  );
};

const CalendarForm = ({ scheduleList, setScheduleList }) => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({});

  const markedDates = useMemo(() => {
    const dates = convertToMarkedDates(scheduleList);
    if (selectedDate) {
      dates[selectedDate] = {
        ...dates[selectedDate],
        selected: true,
        customStyles: {
          container: {
            borderColor: '#87CEEB',
            borderWidth: 2,
            borderRadius: 12,
          },
          text: {
            color: 'black',
          },
        },
      };
    }
    return dates;
  }, [scheduleList, selectedDate]);

  const onDayPress = day => {
    setSelectedDate(day.dateString);
  };

  const selectedSchedule = useMemo(() => {
    if (!selectedDate) return [];
    return scheduleList.filter(
      item =>
        isWithinInterval(parseISO(selectedDate), {
          start: parseISO(item.start),
          end: parseISO(item.end),
        }) || format(parseISO(item.start), 'yyyy-MM-dd') === selectedDate
    );
  }, [selectedDate, scheduleList]);

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

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendarbox}
        current={selectedDate}
        monthFormat={'yyyy.MM'}
        hideExtraDays={false}
        onDayPress={onDayPress}
        markingType={'multi-period'}
        markedDates={markedDates}
        theme={{
          todayTextColor: 'orange',
          arrowColor: 'orange',
          monthTextColor: 'orange',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
      />
      <View style={styles.bottomContainer}>
        <ScrollView style={styles.scheduleList}>
          <Text style={styles.dateText}>
            {format(parseISO(selectedDate), 'MM월 dd일')} 일정
          </Text>
          {selectedSchedule.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.scheduleItem}
              onPress={() => handleEventPress(item)}
            >
              <View
                style={[
                  styles.scheduleIndicator,
                  { backgroundColor: randomColor({ seed: item.scheduleIdx }) },
                ]}
              />
              <View>
                <Text style={styles.scheduleTitle}>{item.title}</Text>
                {differenceInDays(parseISO(item.end), parseISO(item.start)) ===
                0 ? (
                  <Text style={styles.scheduleTime}>{`${format(
                    parseISO(item.start),
                    'HH:mm'
                  )} - ${format(parseISO(item.end), 'HH:mm')}`}</Text>
                ) : (
                  <Text style={styles.scheduleTime}>{`${format(
                    parseISO(item.start),
                    'yyyy-MM-dd HH:mm'
                  )} - ${format(
                    parseISO(item.end),
                    'yyyy-MM-dd HH:mm'
                  )}`}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setCurrentEvent(null);
            setAddModalVisible(true);
          }}
        >
          <Text
            style={styles.addButtonText}
          >{`${selectedDate}에 일정 추가`}</Text>
        </TouchableOpacity>
      </View>
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
};

CalendarForm.propTypes = {
  scheduleList: PropTypes.array.isRequired,
  setScheduleList: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarbox: {
    borderRadius: 8,
    height: 350,
  },
  bottomContainer: {
    flex: 1,
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#FFF',
    padding: 10,
  },
  scheduleList: {},
  dateText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  scheduleIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#87CEEB',
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CalendarForm;
