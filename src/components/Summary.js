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
  onSelectSupplement
}) => {
  console.log("here is data from parent supplement screen",supplement)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* Workout/Exercise Items */}
      {exercises.length > 0 && (
        <>
          {exercises.map((exercise, idx) => (
            <View key={`exercise-${idx}`} style={styles.listContainer}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
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
                <Text style={styles.exerciseName}>{item.name}</Text>
                <TouchableOpacity onPress={() => onDeleteRecovery && onDeleteRecovery(idx)}>
                  <Delete height={21} width={21} />
                </TouchableOpacity>
              </View>
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Time:</Text>
                  <Text style={styles.detailText}>{item.time || '00:00'}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Intensity:</Text>
                  <Text style={styles.detailText}>{item.intensity || 'N/A'}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Rounds:</Text>
                  <Text style={styles.detailText}>{item.rounds || 'N/A'}</Text>
                </View>
              </View>
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
                <Text style={styles.exerciseName}>{item.name}</Text>
                <TouchableOpacity onPress={() => onDeleteCardio && onDeleteCardio(idx)}>
                  <Delete height={21} width={21} />
                </TouchableOpacity>
              </View>
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Duration:</Text>
                  <Text style={styles.detailText}>{item.duration || '00:00'}</Text>
                </View>
                {item.distance && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Distance:</Text>
                    <Text style={styles.detailText}>{item.distance}km</Text>
                  </View>
                )}
                {item.calories && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Calories:</Text>
                    <Text style={styles.detailText}>{item.calories}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </>
      )}

      {/* Supplement Items */}
 {/* Supplement Items */}
 {supplement.length > 0 && (
  <>
    {supplement.map((item, idx) => (
      <TouchableOpacity 
        key={`supplement-${idx}`} 
        style={styles.listContainer}
        onPress={() => onSelectSupplement && onSelectSupplement(item, idx)}
        activeOpacity={0.7}
      >
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          {/* We need to stop propagation on the delete button */}
          <TouchableOpacity 
            onPress={(e) => {
              // Prevent the parent onPress from firing
              e.stopPropagation();
              onDeleteSupplement && onDeleteSupplement(idx);
            }}
          >
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
      </TouchableOpacity>
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
    color: '#000000',
    lineHeight: 20,
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
    justifyContent: 'flex-start',
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
});

export default Summary;