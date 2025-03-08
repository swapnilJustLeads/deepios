import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Delete from '../assets/images/delete.svg';

const Summary = ({ title = "SUMMARY", exercise = "Barbell Deadlift", sets = [
  { reps: 15, weight: 125.9 },
  { reps: 15, weight: 125.9 },
  { reps: 15, weight: 125.9 }
] }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.listContainer}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseName}>{exercise}</Text>
        <Delete height={21} width={21} />
        </View>
        <View style={styles.setsContainer}>
          {sets.map((set, index) => (
            <View key={index} style={styles.setItem}>
              <Text style={styles.setNumber}>{index + 1} |</Text>
              <Text style={styles.setText}>{`${set.reps} × ${set.weight}kg`}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#000000',
    padding: 7,
    marginTop:21
  },
  title: {
    fontFamily: 'Stomic',
    fontSize: 30,
    lineHeight: 45,
    textAlign: 'center',
    color: '#000000',
    textTransform: 'uppercase',
  },
  listContainer: {
    marginTop: 4,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17,
    height: 20,
  },
  exerciseName: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 20,
  },
  deleteIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  setsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    marginTop: 4,
  },
  setItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setNumber: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 18,
    marginRight: 4,
  },
  setText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 18,
  },
});

export default Summary;

