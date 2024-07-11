import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import PropTypes from 'prop-types';
import {
  format,
  startOfDay,
  endOfDay,
  addDays,
  differenceInDays,
  parseISO,
  isWithinInterval,
} from 'date-fns';
import randomColor from 'randomcolor';

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

const CalendarComponent = ({ scheduleList, selectedDate, onDayPress }) => {
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
    </View>
  );
};

CalendarComponent.propTypes = {
  scheduleList: PropTypes.array.isRequired,
  selectedDate: PropTypes.string.isRequired,
  onDayPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarbox: {
    borderRadius: 8,
    height: 350,
  },
});

export default CalendarComponent;
