import React from 'react';
import { View, StyleSheet } from 'react-native';
import CategoryDropdown from './CategoryDropdown';
import ExerciseDropdown from './ExerciseDropdown';
import SetsSection from './SetsSection';
import TimeSection from './TimeSection';
import RepsSection from './RepsSection';
import WeightsSection from './WeightsSection';

const WorkoutLayout = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <CategoryDropdown style={styles.flexItem} />
        <ExerciseDropdown style={styles.flexItem} />
      </View>
      <View style={styles.row}>
        <SetsSection style={styles.flexItem} />
        <TimeSection style={styles.flexItem} />
      </View>
      <RepsSection style={styles.fullWidth} />
      <WeightsSection style={styles.fullWidth} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 342,
    padding: 10,
    backgroundColor: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  flexItem: {
    flexGrow: 1,
    marginHorizontal: 5,
  },
  fullWidth: {
    width: '100%',
    marginBottom: 10,
  },
});

export default WorkoutLayout;

