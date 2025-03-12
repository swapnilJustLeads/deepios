import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Delete from '../assets/images/delete.svg';

const Summary = ({ 
  title, 
  exercises = [],
  cardio = [],
  recovery = [],
  supplement = [],
  onDeleteExercise,
  onDeleteCardio,
  onDeleteRecovery,
  onDeleteSupplement,
  onSelectSupplement,
  onSelectCardio,
  onSelectExercise,
  onSelectRecovery
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* Workout/Exercise Items */}
      {exercises.length > 0 && (
        <>
          {exercises.map((exercise, idx) => (
            <View key={`exercise-${idx}`} style={styles.listContainer}>
              <View style={styles.exerciseHeader}>
                <TouchableOpacity
                  onPress={() => onSelectExercise && onSelectExercise(exercise, idx)}
                >
                  <Text style={[
                    styles.exerciseName, 
                    onSelectExercise && styles.clickableName
                  ]}>
                    {exercise.name}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDeleteExercise && onDeleteExercise(idx)}>
                  <Delete height={21} width={21} />
                </TouchableOpacity>
              </View>
              <View style={styles.setsContainer}>
                {exercise.sets && exercise.sets.map((set, index) => (
                  <View key={index} style={styles.setItem}>
                    <Text style={styles.setNumber}>{index + 1} |</Text>
                    <Text style={styles.setText}>{`${set.reps} × ${set.weight}kg`}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </>
      )}

      {/* Recovery Items */}
      {recovery.length > 0 && (
        <>
          {recovery.map((item, idx) => (
            <View key={`recovery-${idx}`} style={styles.listContainer}>
              <View style={styles.exerciseHeader}>
                <TouchableOpacity
                  onPress={() => onSelectRecovery && onSelectRecovery(item, idx)}
                >
                  <Text style={[
                    styles.exerciseName,
                    onSelectRecovery && styles.clickableName
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDeleteRecovery && onDeleteRecovery(idx)}>
                  <Delete height={21} width={21} />
                </TouchableOpacity>
              </View>
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  {/* <Text style={styles.detailLabel}>Time:</Text> */}
                  <Text style={styles.detailText}>{item.time+ ' min'}</Text>
                </View>
                <View style={styles.detailItem}>
                <Text style={styles.detailText}>{item.rounds + ' rounds'}</Text>

                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailText}>{item.intensity + ' Intesity'}</Text>

                </View>
              </View>
              {idx < recovery.length - 1 && (
          <View style={styles.divider} />
        )}
            </View>
          ))}
        </>
      )}

      {/* Cardio Items */}
      {cardio.length > 0 && (
        <>
          {cardio.map((item, idx) => (
            <View key={`cardio-${idx}`} style={styles.listContainer}>
              <View style={styles.exerciseHeader}>
                <TouchableOpacity
                  onPress={() => onSelectCardio && onSelectCardio(item, idx)}
                >
                  <Text style={[
                    styles.exerciseName, 
                    onSelectCardio && styles.clickableName
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDeleteCardio && onDeleteCardio(idx)}>
                  <Delete height={21} width={21} />
                </TouchableOpacity>
              </View>
              <View style={styles.detailsRow}>
               
                {item.speed && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailText}>{item.speed} min</Text>
                  </View>
                )}
                  {item.time && (
                  <View style={styles.detailItem}>
                
                    <Text style={styles.detailText}>{item.time} km/h</Text>
                  </View>
                )}
                {item.incline && (
                  <View style={styles.detailItem}>
               
                    <Text style={styles.detailText}>{item.incline}% incline</Text>
                  </View>
                )}
               
              </View>
              {idx < cardio.length - 1 && (
          <View style={styles.divider} />
        )}
          

            </View>
          ))}
        </>
      )}

      {/* Supplement Items */}
      {supplement.length > 0 && (
        <>
          {supplement.map((item, idx) => (
            <View key={`supplement-${idx}`} style={styles.listContainer}>
              <View style={styles.exerciseHeader}>
                <TouchableOpacity
                  onPress={() => onSelectSupplement && onSelectSupplement(item, idx)}
                >
                  <Text style={[
                    styles.exerciseName,
                    onSelectSupplement && styles.clickableName
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDeleteSupplement && onDeleteSupplement(idx)}>
                  <Delete height={21} width={21} />
                </TouchableOpacity>
              </View>
              <View style={styles.detailsRow}>
                {item.amount && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Amount:</Text>
                    <Text style={styles.detailText}>{item.amount}</Text>
                  </View>
                )}
                {item.liquid && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Liquid:</Text>
                    <Text style={styles.detailText}>{item.liquid}</Text>
                  </View>
                )}
                {item.company && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Company:</Text>
                    <Text style={styles.detailText}>{item.company}</Text>
                  </View>
                )}
                {item.timing && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Timing:</Text>
                    <Text style={styles.detailText}>
                      {item.timing.replace(/_/g, ' ')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </>
      )}

      {/* Show empty state if no items of any type */}
      {exercises.length === 0 && cardio.length === 0 && recovery.length === 0 && supplement.length === 0 && (
        <Text style={styles.emptyText}>No items added yet</Text>
      )}
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
    marginTop: 21,
  },
  title: {
    fontFamily: 'Stomic',
    fontSize: 30,
    lineHeight: 45,
    textAlign: 'center',
    color: '#000000',
    textTransform: 'uppercase',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'Inter',
  },
  listContainer: {
    marginTop: 4,
    marginBottom: 8,
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
    lineHeight: 20,
    textTransform:'capitalize',
  },
  clickableName: {


  },
  setsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingHorizontal: 17,
    marginTop: 4,
  },
  setItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
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
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 17,
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  detailLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    marginRight: 4,
  },
  detailText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 18,
  },
  supplementName:{
    fontFamily:'Inter',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
   
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0', // Light gray color, adjust as needed
    // marginVertical: 8,          // Adjust vertical spacing as needed
    width: '100%',
    marginTop:12
  },
});

export default Summary;