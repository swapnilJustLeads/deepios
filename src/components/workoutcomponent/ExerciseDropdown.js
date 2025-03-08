import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const ExerciseDropdown = ({ style }) => {
  const [selectedExercise, setSelectedExercise] = useState('Barbell Deadlift');

  const exercises = [
    { label: 'Barbell Deadlift', value: 'Barbell Deadlift' },
    { label: 'Bench Press', value: 'Bench Press' },
    { label: 'Squats', value: 'Squats' },
    { label: 'Pull Ups', value: 'Pull Ups' }
  ];

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Exercise</Text>
      <Dropdown
        style={styles.dropdown}
        data={exercises}
        labelField="label"
        valueField="value"
        placeholder="Select exercise"
        value={selectedExercise}
        onChange={item => {
          setSelectedExercise(item.value);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 165,
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 5,
  },
  dropdown: {
    height: 30,
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
  },
});

export default ExerciseDropdown;

