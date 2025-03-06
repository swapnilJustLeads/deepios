import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const getSurroundingDates = (selectedDate) => {
  const dates = [];
  for (let i = -3; i <= 3; i++) {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + i);
    dates.push(newDate);
  }
  return dates;
};

const formatDate = (date, isSelected) => {
  return isSelected
    ? `${date.toLocaleDateString('en-US', { weekday: 'short' })}, ${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })}`
    : date.getDate();
};

const Calendar = ({ setDate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [surroundingDates, setSurroundingDates] = useState(getSurroundingDates(new Date()));

  useEffect(() => {
    setSurroundingDates(getSurroundingDates(selectedDate));
    if (setDate) {
      setDate(selectedDate);
    }
  }, [selectedDate, setDate]);

  return (
    <View style={styles.container}>
      {/* Date Selector Row */}
      <View style={styles.dateRow}>
        {surroundingDates.map((date, index) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          return (
            <TouchableOpacity
              key={index}
              style={[styles.dateItem, isSelected && styles.selectedDate]}
              onPress={() => {
                if (isSelected) {
                  setCalendarVisible(true);
                } else {
                  setSelectedDate(date);
                }
              }}
            >
              <Text style={isSelected ? styles.selectedText : styles.dateText}>
                {formatDate(date, isSelected)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Date Picker Modal */}
      {calendarVisible && (
        <Modal transparent animationType="slide">
          <View style={styles.modalContainer}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={(event, date) => {
                setCalendarVisible(false);
                if (date) {
                  setSelectedDate(date);
                }
              }}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  dateItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
  },
  selectedDate: {
    backgroundColor: '#000',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateText: {
    color: '#000',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default Calendar;
