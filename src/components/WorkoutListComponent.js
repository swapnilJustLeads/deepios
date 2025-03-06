import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card, Icon} from '@rneui/themed';
import Copy from '../assets/images/copy.svg';
import Edit from '../assets/images/edit.svg';
import Delete from '../assets/images/delete.svg';

const WorkoutListComponent = () => {
  const workouts = [
    {name: 'Barbell Bench Press', sets: ['1 | 3 × 1kg', '2 | 1', '3 | 1']},
    {name: 'Barbell Russian Twists', sets: ['1 | 1 × 0.5kg', '2 | 1', '3 | 1']},
    {name: 'Annie', sets: ['1 | 3 × 1.5kg']},
  ];

  return (
    <Card containerStyle={styles.card}>
      <View style={styles.header}>
        <Text style={styles.workoutText}>WORKOUT</Text>
        <Text style={styles.time}>12:10 pm</Text>
        <View style={styles.icons}>
          <Edit  />
          <Copy style={styles.iconSpacing} />
          <Delete style={styles.iconSpacing} />

          {/* <Icon name="repeat" type="material-community" size={18} />
          <Icon name="file-document-outline" type="material-community" size={18} style={styles.iconSpacing} />
          <Icon name="delete-outline" type="material-community" size={18} style={styles.iconSpacing} /> */}
        </View>
      </View>

      {workouts.map((workout, index) => (
        <View key={index}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <View style={styles.setRow}>
            {workout.sets.map((set, setIndex) => (
              <Text key={setIndex} style={styles.setText}>
                {set}
              </Text>
            ))}
          </View>
          {index < workouts.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </Card>
  );
};

export default WorkoutListComponent;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 15,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'black',
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutText: {
    fontSize: 27,
    fontWeight: '400',
    fontFamily:'Stomic'
  
  },
  time: {
    fontSize: 14,
    fontWeight: '500',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginLeft: 8,
  },
  workoutName: {
    fontSize: 16,
    // fontWeight: 'bold',
    marginTop: 10,
    fontFamily:'Inter',
    fontWeight:'700'
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  setText: {
    fontSize: 14,
    fontWeight: '500',
        fontFamily:'Inter',
        fontWeight:'400',
  

  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    marginVertical: 8,
  },
});
