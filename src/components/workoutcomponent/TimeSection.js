import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const TimeSection = ({ style }) => {
  const [hours, setHours] = useState('07');
  const [minutes, setMinutes] = useState('19');

  const hoursData = Array.from({ length: 24 }, (_, i) => ({ label: i.toString().padStart(2, '0'), value: i }));
  const minutesData = Array.from({ length: 60 }, (_, i) => ({ label: i.toString().padStart(2, '0'), value: i }));

  return (
    <View style={[styles.container, style]}>
      <Dropdown
        style={styles.dropdown}
        data={hoursData}
        labelField="label"
        valueField="value"
        value={hours}
        onChange={item => setHours(item.label)}
      />
      <Dropdown
        style={styles.dropdown}
        data={minutesData}
        labelField="label"
        valueField="value"
        value={minutes}
        onChange={item => setMinutes(item.label)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minWidth: 120,
    height: 30,
  },
  dropdown: {
    width: 48,
    height: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TimeSection;

