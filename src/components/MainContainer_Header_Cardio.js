// Update the MainContainer_Header_ExerciseItem component to display weight and incline separately
import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import Copy from '../assets/images/copy.svg';
import Edit from '../assets/images/edit.svg';
import Delete from '../assets/images/delete.svg';

const MainContainer_Header_Cardio = ({exercises = [], title, time}) => {
  console.log('Exercise data:', exercises);
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
          <View
            key={index}
            style={[
              styles.exerciseItem,
              index === exercises.length - 1 && styles.lastExerciseItem,
            ]}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.setsContainer}>
              {exercise.sets &&
                exercise.sets.map((set, setIndex) => {
                  // For cardio data that has speed and incline
                  if (set.speed !== undefined && set.incline !== undefined) {
                    return (
                      <View key={setIndex} style={styles.setRow}>
                        <Text style={styles.setNumber}>
                          {set.number || setIndex + 1} |
                        </Text>
                        <View style={styles.detailsContainer}>
                          <Text style={styles.detailText}>
                            <Text style={styles.detailLabel}>Speed: </Text>
                            <Text>{set.speed}</Text>
                          </Text>
                          <Text style={styles.detailText}>
                            <Text style={styles.detailLabel}>Incline: </Text>
                            <Text>{set.incline}</Text>
                          </Text>
                        </View>
                      </View>
                    );
                  }
                  // For workout data with weight and incline in one string
                  else if (
                    typeof set.weight === 'string' &&
                    set.weight.includes('Incline')
                  ) {
                    // Split the weight string to extract the separate values
                    const parts = set.weight.split(',');
                    const weightValue = parts[0].trim();
                    let inclineValue = '';

                    if (parts.length > 1) {
                      const inclineMatch = parts[1].match(/(\d+)/);
                      inclineValue = inclineMatch ? inclineMatch[0] : '';
                    }

                    return (
                      <View key={setIndex} style={styles.setRow}>
                        {set.number > 0 && (<Text style={styles.setNumber}>{set.number}min</Text>) }
                        
                        <View style={styles.detailsContainer}>
                          {weightValue > 0 && (
                            <Text style={styles.detailText}>
                              <Text>{weightValue} km/r</Text>
                            </Text>
                          )}

                          {inclineValue > 0 && (
                            <Text style={styles.detailText}>
                              <Text>{inclineValue}%</Text>
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  }
                  // For standard workout data with just weight
                  else {
                    return (
                      <View key={setIndex} style={styles.setRow}>
                        <Text style={styles.setNumber}>
                          {set.number || setIndex + 1} |
                        </Text>
                        <Text style={styles.setWeight}>{set.weight}</Text>
                      </View>
                    );
                  }
                })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Keep all existing styles
  container: {
    width: '90%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    overflow: 'hidden',
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
    borderBottomColor: '#DDDDDD',
  },
  lastExerciseItem: {
    borderBottomWidth: 0,
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
    justifyContent: 'space-between',
    // minWidth: 120,
    // paddingRight: 9,
    // marginBottom: 4,
    backgroundColor:'red'
  },
  setNumber: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginRight: 4,
    textAlign: 'right',
    width: 18,
  },
  setWeight: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 18,
  },

  // Add new styles for the separated display
  detailsContainer: {
    flexDirection: 'column',
  },
  detailText: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 18,
  },
  detailLabel: {
    fontWeight: '600',
  },
});

export default MainContainer_Header_Cardio;
