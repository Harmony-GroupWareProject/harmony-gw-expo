import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const EditEventModal = ({
  visible,
  onClose,
  onSave,
  onDelete,
  currentEvent,
}) => {
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventStartDate, setNewEventStartDate] = useState(new Date());
  const [newEventStartTime, setNewEventStartTime] = useState('');
  const [newEventEndDate, setNewEventEndDate] = useState(new Date());
  const [newEventEndTime, setNewEventEndTime] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setNewEventTitle(currentEvent.title || '');
      setNewEventStartDate(new Date(currentEvent.start.split('T')[0]));
      setNewEventStartTime(currentEvent.start.split('T')[1].substring(0, 5));
      setNewEventEndDate(new Date(currentEvent.end.split('T')[0]));
      setNewEventEndTime(currentEvent.end.split('T')[1].substring(0, 5));
      setIsAllDay(currentEvent.allDay || false);
      setShowStartDatePicker(false);
      setShowStartTimePicker(false);
      setShowEndDatePicker(false);
      setShowEndTimePicker(false);
    }
  }, [visible, currentEvent]);

  const handleUpdate = () => {
    onSave({
      scheduleIdx: currentEvent.scheduleIdx,
      title: newEventTitle,
      start: `${
        newEventStartDate.toISOString().split('T')[0]
      }T${newEventStartTime}:00`,
      end: `${
        newEventEndDate.toISOString().split('T')[0]
      }T${newEventEndTime}:00`,
      allDay: isAllDay,
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(currentEvent.scheduleIdx);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || newEventStartDate;
    setShowStartDatePicker(false);
    setNewEventStartDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || newEventStartTime;
    setShowStartTimePicker(false);
    setNewEventStartTime(format(currentTime, 'HH:mm'));
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || newEventEndDate;
    setShowEndDatePicker(false);
    setNewEventEndDate(currentDate);
  };

  const handleEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || newEventEndTime;
    setShowEndTimePicker(false);
    setNewEventEndTime(format(currentTime, 'HH:mm'));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.titleInput}
            placeholder="제목"
            value={newEventTitle}
            onChangeText={setNewEventTitle}
          />
          <View style={styles.switchContainer}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color="black"
            />
            <Text style={styles.switchLabel}>하루 종일</Text>
            <Switch value={isAllDay} onValueChange={setIsAllDay} />
          </View>
          <View style={styles.dateTimeContainer}>
            <View style={styles.startContainer}>
              <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                <Text style={styles.dateText}>
                  {format(newEventStartDate, 'yyyy-MM-dd')}
                </Text>
              </TouchableOpacity>
              {!isAllDay && (
                <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
                  <Text style={styles.timeText}>{newEventStartTime}</Text>
                </TouchableOpacity>
              )}
            </View>
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color="black"
            />
            <View style={styles.endContainer}>
              <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                <Text style={styles.dateText}>
                  {format(newEventEndDate, 'yyyy-MM-dd')}
                </Text>
              </TouchableOpacity>
              {!isAllDay && (
                <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
                  <Text style={styles.timeText}>{newEventEndTime}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {showStartDatePicker && (
            <DateTimePicker
              value={newEventStartDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
          {showStartTimePicker && (
            <DateTimePicker
              value={new Date(`1970-01-01T${newEventStartTime}:00`)}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
          {showEndDatePicker && (
            <DateTimePicker
              value={newEventEndDate}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
          {showEndTimePicker && (
            <DateTimePicker
              value={new Date(`1970-01-01T${newEventEndTime}:00`)}
              mode="time"
              display="default"
              onChange={handleEndTimeChange}
            />
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
              <Text style={styles.buttonText}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleDelete}>
              <Text style={styles.buttonText}>삭제</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

EditEventModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  currentEvent: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  titleInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    flex: 1,
    marginLeft: 10,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  startContainer: {
    alignItems: 'center',
  },
  endContainer: {
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default EditEventModal;
