import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import CalendarUI from './CalendarUI';

const InlineCalendarPicker = ({ onSelectDate, onCancel, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    // If you want immediate feedback, uncomment the next line
    // onSelectDate(date);
  };
  
  const handleConfirmPress = () => {
    if (selectedDate && onConfirm) {
      onConfirm(selectedDate);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Date</Text>
      
      <View style={styles.calendarContainer}>
        <CalendarUI 
          onSelectDate={handleDateSelect}
          initialDate={selectedDate}
        />
      </View>
      
      {selectedDate && (
        <Text style={styles.selectedDateText}>
          {moment(selectedDate).format('MMM D, YYYY')}
        </Text>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={onCancel}
        >
          <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirmPress}
        >
          <Text style={styles.confirmText}>CONFIRM</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  calendarContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedDateText: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
    marginBottom: 10,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 5,
  },
  cancelText: {
    color: '#000',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#00E5FF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 5,
  },
  confirmText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default InlineCalendarPicker;