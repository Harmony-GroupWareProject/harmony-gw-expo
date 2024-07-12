import { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  format,
  parseISO,
  differenceInDays,
  isWithinInterval,
  isToday,
} from 'date-fns';
import randomColor from 'randomcolor';

const ScheduleListComponent = ({
  scheduleList,
  selectedDate,
  onEventPress,
  onAddEvent,
  showAddButton = true,
  showModals = true,
}) => {
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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scheduleList}>
        <Text style={styles.dateText}>
          {isToday(parseISO(selectedDate))
            ? `오늘일정`
            : `${format(parseISO(selectedDate), 'MM월 dd일')} 일정`}
        </Text>
        {selectedSchedule.length > 0 ? (
          selectedSchedule.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.scheduleItem}
              onPress={() => showModals && onEventPress(item)}
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
                  item.allDay ? (
                    <Text style={styles.scheduleTime}>하루종일</Text>
                  ) : (
                    <Text style={styles.scheduleTime}>
                      {`${format(parseISO(item.start), 'HH:mm')} - ${format(
                        parseISO(item.end),
                        'HH:mm'
                      )}`}
                    </Text>
                  )
                ) : item.allDay ? (
                  <Text style={styles.scheduleTime}>
                    {`${format(parseISO(item.start), 'yyyy-MM-dd')} - ${format(
                      parseISO(item.end),
                      'yyyy-MM-dd'
                    )} 하루종일`}
                  </Text>
                ) : (
                  <Text style={styles.scheduleTime}>
                    {`${format(
                      parseISO(item.start),
                      'yyyy-MM-dd HH:mm'
                    )} - ${format(parseISO(item.end), 'yyyy-MM-dd HH:mm')}`}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptySchedule}>
            {format(parseISO(selectedDate), 'MM월 dd일')} 일정은 없습니다.
          </Text>
        )}
      </ScrollView>
      {showAddButton && (
        <TouchableOpacity style={styles.addButton} onPress={onAddEvent}>
          <Text
            style={styles.addButtonText}
          >{`${selectedDate}에 일정 추가`}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

ScheduleListComponent.propTypes = {
  scheduleList: PropTypes.array.isRequired,
  selectedDate: PropTypes.string.isRequired,
  onEventPress: PropTypes.func.isRequired,
  onAddEvent: PropTypes.func.isRequired,
  showAddButton: PropTypes.bool,
  showModals: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
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
  emptySchedule: {
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#ff7417',
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

export default ScheduleListComponent;
