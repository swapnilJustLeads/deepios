import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Copy from '../assets/images/copy.svg';
import Edit from '../assets/images/edit.svg';
import Delete from '../assets/images/delete.svg';


const MainContainer_Header_Recovery = ({ exercises = [], title, time }) => {
  // Use the provided time or default
  const displayTime = time || '07:57 AM';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
          {/* Centered time display */}
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{displayTime}</Text>
      </View>
        <View style={styles.headerButtons}>
          <Edit style={styles.headerIcon} />
          <Copy style={styles.headerIcon} />
          <Delete style={styles.headerIcon} />
        </View>
      </View>
      
    

      <ScrollView contentContainerStyle={styles.exerciseList}>
        <Text>{JSON.stringify(exercises)} </Text>
        {/* {exercises.map((exercise, index) => (
          <View key={index} style={[
            styles.exerciseItem,
            index == exercises.length - 1 && styles.lastExerciseItem
          ]}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.setsContainer}>
              {exercise.sets.map((set, setIndex) => (
                <View key={setIndex} style={styles.setRow}>
                  <Text style={styles.setNumber}>{set.number} |</Text>
                  <Text style={styles.setWeight}>{set.weight}</Text>
                  <Text style={styles.setWeight}>{set.incline}</Text>
                </View>
              ))}
            </View>
          </View>
        ))} */}
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
    justifyContent: 'space-between',
    paddingHorizontal: 21,
    paddingTop: 8,
    paddingBottom: 2,
  },
  title: {
    fontFamily: 'Stomic',
    fontSize: 17.86,
    lineHeight: 27,
    textTransform: 'uppercase',
  },
  timeContainer: {
    alignItems: 'center',
    alignSelf:'center',
    justifyContent:'center'
    
  },
  time: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    alignItems: 'center',
    alignSelf:'center',
    justifyContent:'center'
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
    alignItems: 'center',   
    minWidth: 93,
    paddingRight: 9,
  },
  setNumber: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginRight: 4,
    textAlign: 'right',
    width: 18
  },
  setWeight: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
});

export default MainContainer_Header_Recovery;