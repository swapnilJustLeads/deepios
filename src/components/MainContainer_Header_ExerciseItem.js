import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Copy from '../assets/images/copy.svg';
import Edit from '../assets/images/edit.svg';
import Delete from '../assets/images/delete.svg';


const MainContainer_Header_ExerciseItem = ({ exercises = [], title, time }) => {
  // Use the provided title directly without modification
  const displayTime = time || '07:57 AM';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{displayTime}</Text>
        <View style={styles.headerButtons}>
          <Edit style={styles.headerIcon} />
          <Copy style={styles.headerIcon} />
          <Delete style={styles.headerIcon} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.exerciseList}>
        {exercises.map((exercise, index) => (
          <View key={index} style={[
            styles.exerciseItem,
            index === exercises.length - 1 && styles.lastExerciseItem
          ]}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.setsContainer}>
              {exercise.sets.map((set, setIndex) => (
                <View key={setIndex} style={styles.setRow}>
                  <Text style={styles.setNumber}>{set.number} |</Text>
                  <Text style={styles.setWeight}>{set.weight}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    overflow: 'hidden',
    // Remove fixed height to allow it to grow
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingVertical: 8,
  },
  title: {
    fontFamily: 'Stomic',
    fontSize: 17.86,
    lineHeight: 27,
    textTransform: 'uppercase',
  },
  time: {
    marginLeft: 'auto',
    marginRight: 38,
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIcon: {
    width: 20,
    height: 20,
  },
  exerciseList: {
    paddingHorizontal: 21,
  },
  exerciseItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD', // Lighter border color for dividers
  },
  lastExerciseItem: {
    borderBottomWidth: 0, // Remove border for last item
  },
  exerciseName: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 8,
  },
  setsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  setRow: {
    flexDirection: 'row',
    justifyContent:'flex-start',   
    minWidth: 93,
    paddingRight: 9,
  },
  setNumber: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginRight: 4,
    textAlign:'right',
    width: 18
  },
  setWeight: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 18,
  },
});

export default MainContainer_Header_ExerciseItem;