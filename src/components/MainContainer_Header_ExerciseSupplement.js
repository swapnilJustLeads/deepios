import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Copy from '../assets/images/copy.svg';
import Edit from '../assets/images/edit.svg';
import Delete from '../assets/images/delete.svg';

const MainContainer_Header_ExerciseSupplement = ({ exercises = [], title, externalData }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Supplement</Text>
        <Text style={styles.time}>07:57 AM</Text>
        <View style={styles.headerButtons}>
        <Edit style={styles.headerIcon} />
          <Copy  style={styles.headerIcon} />
          <Delete  style={styles.headerIcon} />
        </View>
      </View>


      <ScrollView contentContainerStyle={styles.exerciseList}>
      
      <Text style={styles.exerciseName}>{JSON.stringify(externalData)}</Text>
        {/* <Text>{JSON.stringify(exercises)} </Text>
        <View  style={styles.exerciseItem}>
        <Text style={styles.exerciseName}>{title}</Text>
        <Text style={styles.exerciseName}>{JSON.stringify(exercises)}</Text>
        </View> */}
        {exercises?.data?.map((exercise, index) => (
          <View key={index} style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{exercise.timing}</Text>
            <Text style={styles.exerciseName}>{exercise.company}</Text>
            <View  style={styles.setRow}>
                  {/* <Text>{JSON.stringify(externalData)}</Text> */}
                  {/* <Text style={styles.setNumber}>{set.number} |</Text>
                  <Text style={styles.setWeight}>{set.weight}</Text> */}
                </View>
            {/* <View style={styles.setsContainer}>
              {exercise.sets.map((set, setIndex) => (
                <View key={setIndex} style={styles.setRow}>
                  <Text style={styles.setNumber}>{set.number} |</Text>
                  <Text style={styles.setWeight}>{set.weight}</Text>
                </View>
              ))}
            </View> */}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignSelf:'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    overflow: 'hidden',
    maxHeight:388,
    marginBottom: 16,

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 21,
    paddingVertical: 8,
    // borderBottomWidth: 1,
    borderBottomColor: '#000',
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
    borderBottomColor: '#000',
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
    
    // backgroundColor:'green'
    
    // gap: 8,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent:'flex-start',   
    // alignItems: 'center',
    minWidth: 93,
    // backgroundColor:'red',
    paddingRight:9,
    
  },
  setNumber: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginRight: 4,
    textAlign:'right',
    // backgroundColor:'red',
    width:18

  },
  setWeight: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 18,
    
  },
});

export default MainContainer_Header_ExerciseSupplement;

