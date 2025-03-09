import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MainContainer_Header_ExerciseItem from './MainContainer_Header_ExerciseItem';
import { useUserWorkoutContext, useUserRecoveryContext, useUserCardioContext } from '../context/UserContexts';
import { useDetails } from '../context/DeatailsContext';
import moment from 'moment';

const WorkoutLayout = (props) => {
  const { workoutData } = useUserWorkoutContext();
  const { recoveryData } = useUserRecoveryContext();
  const { cardioData } = useUserCardioContext();
  const { parentIds, subCategories } = useDetails();
  
  // Get the type from props (default to 'workout')
  const type = props.type?.toLowerCase() || 'workout';
  
  // Get the appropriate data based on type
  const getData = () => {
    switch(type) {
      case 'recovery':
        return recoveryData || [];
      case 'cardio':
        return cardioData || [];
      case 'workout':
      default:
        return workoutData || [];
    }
  };
  
  const dataSource = getData();
  
  // Filter data for the selected date
  const selectedDate = props.selectedDate || moment().format('YYYY-MM-DD');
  
  const filteredData = dataSource.filter(item => {
    if (item.createdAt) {
      const itemDate = moment(item.createdAt.seconds * 1000).format('YYYY-MM-DD');
      return itemDate === selectedDate;
    }
    return false;
  });
  
  // Helper function to get exercise name from subCategory ID
  function getExerciseName(subCategoryId) {
    if (!subCategoryId || !subCategories) return 'Unknown Exercise';
    
    const subCategory = subCategories.find(sc => sc.id === subCategoryId);
    return subCategory ? subCategory.name : 'Unknown Exercise';
  }
  
  // Transform data based on its type
  const transformData = () => {
    const transformedData = [];
    
    filteredData.forEach(item => {
      if (!item.data || !Array.isArray(item.data)) return;
      
      if (type === 'workout') {
        // Transform workout data
        item.data.forEach(exercise => {
          const exerciseName = getExerciseName(exercise.subCategory);
          
          // Create sets array based on reps and weights arrays
          const setsArray = [];
          if (Array.isArray(exercise.reps) && Array.isArray(exercise.weights)) {
            const setCount = Math.min(exercise.reps.length, exercise.weights.length);
            
            for (let i = 0; i < setCount; i++) {
              setsArray.push({
                number: String(i + 1),
                weight: `${exercise.reps[i] || 0} × ${exercise.weights[i] || 0}kg`
              });
            }
          }
          
          transformedData.push({
            name: exerciseName || 'Unnamed Exercise',
            sets: setsArray
          });
        });
      } else if (type === 'recovery') {
        // Transform recovery data
        item.data.forEach(recovery => {
          const recoveryName = getExerciseName(recovery.subCategory) || recovery.name || 'Recovery Activity';
          
          // For recovery, we'll show duration instead of weight
          const setsArray = [
            {
              number: '1',
              weight: `${recovery.duration || 0} min`
            }
          ];
          
          transformedData.push({
            name: recoveryName,
            sets: setsArray
          });
        });
      } else if (type === 'cardio') {
        // Transform cardio data
        item.data.forEach(cardio => {
          const cardioName = getExerciseName(cardio.subCategory) || cardio.name || 'Cardio Activity';
          
          // For cardio, we'll show duration and distance/intensity
          const setsArray = [
            {
              number: '1',
              weight: `${cardio.duration || 0} min, ${cardio.distance || 0} km`
            }
          ];
          
          transformedData.push({
            name: cardioName,
            sets: setsArray
          });
        });
      }
    });
    
    return transformedData;
  };
  
  const exerciseData = transformData();

  return (
    <View style={styles.container}>
      {exerciseData.length > 0 ? (
        <MainContainer_Header_ExerciseItem 
          title={props.title || type.charAt(0).toUpperCase() + type.slice(1)} 
          exercises={exerciseData} 
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No {type} activities found for today</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noDataText: {
    fontSize: 16,
    color: '#555',
  }
});

export default WorkoutLayout;