import React from 'react';
import { View, StyleSheet } from 'react-native';
import MainContainer_Header_ExerciseItem from './MainContainer_Header_ExerciseItem';

const exerciseData = [
  {
    name: 'Seated Row Machine',
    sets: [
      { number: '1', weight: '15 × 125,9kg' },
      { number: '2', weight: '15 × 125,9kg' },
      { number: '3', weight: '15 × 125,9kg' },
      { number: '4', weight: '15 × 125,9kg' },
      { number: '5', weight: '15 × 125,9kg' },
    ]
  },
  {
    name: 'Lat Pulldown Machine',
    sets: [
      { number: '1', weight: '15 × 125,9kg' },
      { number: '2', weight: '15 × 125,9kg' },
      { number: '3', weight: '15 × 125,9kg' },
      { number: '4', weight: '15 × 125,9kg' },
      { number: '5', weight: '15 × 125,9kg' },
    ]
  },
  {
    name: 'Latzug (vorne)',
    sets: [
      { number: '1', weight: '15 × 125,9kg' },
      { number: '2', weight: '15 × 125,9kg' },
      { number: '3', weight: '15 × 125,9kg' },
      { number: '4', weight: '15 × 125,9kg' },
      { number: '5', weight: '15 × 125,9kg' },
    ]
  },
  // {
  //   name: 'Butterfly Reverse',
  //   sets: [
  //     { number: '1', weight: '15 × 125,9kg' },
  //     { number: '2', weight: '15 × 125,9kg' },
  //     { number: '3', weight: '15 × 125,9kg' },
  //     { number: '4', weight: '15 × 125,9kg' },
  //     { number: '5', weight: '15 × 125,9kg' },
  //   ]
  // },
  // {
  //   name: 'Römische Liege',
  //   sets: [
  //     { number: '1', weight: '15 × 125,9kg' },
  //     { number: '2', weight: '15 × 125,9kg' },
  //     { number: '3', weight: '15 × 125,9kg' },
  //   ]
  // },
  {
    name: 'Rudermaschine (einarmig)',
    sets: [
      { number: '1', weight: '15 × 125,9kg' },
      { number: '2', weight: '15 × 125,9kg' },
      { number: '3', weight: '15 × 125,9kg' },
    ]
  }
];

const WorkoutLayout = (props) => {
  return (
    <View style={styles.container}>
      <MainContainer_Header_ExerciseItem title={props.title} exercises={exerciseData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    
  },
});

export default WorkoutLayout;
