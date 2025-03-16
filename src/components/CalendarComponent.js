import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [markedDates, setMarkedDates] = useState(generateWeek(moment()));

  function generateWeek(startDate) {
    let week = {};
    for (let i = 0; i < 7; i++) {
      const date = moment(startDate).add(i, 'days').format('YYYY-MM-DD');
      week[date] = { marked: true };
    }
    return week;
  }

  function handleDayPress(day) {
    const lastDate = Object.keys(markedDates).pop();

    if (day.dateString === lastDate) {
      const nextWeekStart = moment(lastDate).add(1, 'days');
      setMarkedDates((prev) => ({
        ...prev,
        ...generateWeek(nextWeekStart),
      }));
    }

    setSelectedDate(day.dateString);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Date</Text>
      <Calendar
        current={selectedDate}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, selectedColor: 'blue' },
        }}
        onDayPress={handleDayPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default CalendarComponent;
