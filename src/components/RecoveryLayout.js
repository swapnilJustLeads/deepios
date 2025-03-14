import React, { useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import MainContainer_Header_ExerciseItem from './MainContainer_Header_ExerciseItem';
import { useUserWorkoutContext, useUserRecoveryContext, useUserCardioContext } from '../context/UserContexts';
import { useDetails } from '../context/DeatailsContext';
import moment from 'moment';
import MainContainer_Header_Recovery from './MainContainer_Header_Recovery';

const RecoveryLayout = (props) => {
  const { workoutData } = useUserWorkoutContext();
  const { recoveryData } = useUserRecoveryContext();
  const { cardioData } = useUserCardioContext();
  const { parentIds, subCategories } = useDetails();

  // Get the type from props (default to 'workout')
  const type = props.type?.toLowerCase() || 'workout';

  // Get the appropriate data based on type
  const getData = () => {
    switch (type) {
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

  // Log for debugging
  useEffect(() => {
    console.log(`Selected date: ${selectedDate}`);
    console.log(`Data source length: ${dataSource.length}`);
    
    // Log a sample of timestamps for debugging
    if (dataSource.length > 0) {
      dataSource.slice(0, 3).forEach((item, index) => {
        if (item.createdAt) {
          const timestamp = item.createdAt.seconds 
            ? moment.unix(item.createdAt.seconds).format("YYYY-MM-DD HH:mm:ss")
            : 'Invalid timestamp';
          console.log(`Item ${index} timestamp: ${timestamp}`);
        } else {
          console.log(`Item ${index} has no createdAt property`);
        }
      });
    }
  }, [selectedDate, dataSource]);

  // Improved filtering for date comparison
  const filteredData = dataSource.filter(item => {
    if (!item.createdAt) return false;
    
    // Handle both timestamp formats (Firestore timestamp and regular Date)
    let itemDate;
    if (item.createdAt.seconds) {
      // Firestore timestamp
      itemDate = moment.unix(item.createdAt.seconds).startOf('day');
    } else if (item.createdAt instanceof Date) {
      // Regular Date object
      itemDate = moment(item.createdAt).startOf('day');
    } else if (typeof item.createdAt === 'string') {
      // ISO string format
      itemDate = moment(item.createdAt).startOf('day');
    } else {
      return false;
    }
    
    // Compare with selected date (also at start of day)
    const compareDateStart = moment(selectedDate).startOf('day');
    const compareDateEnd = moment(selectedDate).endOf('day');
    
    return itemDate.isSameOrAfter(compareDateStart) && itemDate.isSameOrBefore(compareDateEnd);
  });

  // Helper function to get exercise name from subCategory ID
  function getExerciseName(subCategoryId, exerciseName) {
    if (exerciseName) return exerciseName; // Use stored name directly
    if (!subCategoryId || !subCategories) return 'Unknown Exercise';

    const subCategory = subCategories.find(sc => sc.id === subCategoryId);
    return subCategory ? subCategory.name : 'Unknown Exercise';
  }

  // Transform data to keep workout sessions separate
  const transformData = () => {
    return filteredData.map(item => {
      // Get time from createdAt timestamp
      let timestamp;
      
      if (item.createdAt) {
        if (item.createdAt.seconds) {
          // Firestore timestamp
          timestamp = moment(new Date(item.createdAt.seconds * 1000));
        } else if (item.createdAt instanceof Date) {
          // Regular Date object
          timestamp = moment(item.createdAt);
        } else if (typeof item.createdAt === 'string') {
          // ISO string format
          timestamp = moment(item.createdAt);
        }
      }
      
      const timeString = timestamp ? timestamp.format('hh:mm A') : '';

      // Transform exercises based on type
      const exercises = [];

      if (!item.data || !Array.isArray(item.data)) return null;

      if (type === 'workout') {
        // Transform workout data
        item.data.forEach(exercise => {
          const exerciseName = getExerciseName(exercise.subCategory, exercise.exerciseName);

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

          exercises.push({
            name: exerciseName || 'Unnamed Exercise',
            sets: setsArray
          });
        });
      } else if (type === 'recovery') {
        // Transform recovery data
        item.data.forEach(recovery => {
          const recoveryName = getExerciseName(recovery.subCategory, recovery.name) || 'Recovery Activity';

          // For recovery, we'll show time/duration and intensity
          const setsArray = [
            {
              number: '1',
              weight: `${recovery.time || '0'} min, Intensity: ${recovery.intensity || 'N/A'}`
            }
          ];

          exercises.push({
            name: recoveryName,
            sets: setsArray
          });
        });
      } else if (type === 'cardio') {
        // Transform cardio data to match web display format
        item.data.forEach(cardio => {
          const cardioName = getExerciseName(cardio.subCategory, cardio.name) || 'Cardio Activity';

          // For cardio, we need to format it like the web version
          // Extract time parts from duration if available
          let durationText = '';
          if (cardio.duration) {
            // If duration is in format HH:MM
            durationText = cardio.duration;
          }

          // Create sets array to match web display format
          const setsArray = [
            {
              number: '1',
              // Format to match web display with speed and incline
              weight: `${cardio.speed || 'N/A'}, ${cardio.incline || '0%'} Incline`
            }
          ];

          // Add location if available
          if (cardio.location) {
            setsArray[0].location = cardio.location;
          }

          exercises.push({
            name: cardioName,
            duration: durationText,
            sets: setsArray
          });
        });
      }

      return {
        time: timeString,
        exercises: exercises,
        id: item.id || `${type}-${timestamp?.valueOf() || Date.now()}`,
        originalData: item // Store the original item for use when clicked
      };
    }).filter(Boolean); // Remove any null entries
  };

  const sessionData = transformData();

  // Sort session data by time (latest first)
  const sortedSessionData = [...sessionData].sort((a, b) => {
    // Parse times to compare
    const timeA = moment(a.time, 'hh:mm A');
    const timeB = moment(b.time, 'hh:mm A');
    
    // Sort in descending order (latest first)
    return timeB.valueOf() - timeA.valueOf();
  });

  // Function to handle item click
  const handleItemClick = (session) => {
    // If onSelectItem prop exists, call it with the clicked item's original data
    if (props.onSelectItem && session.originalData) {
      props.onSelectItem(session.originalData);
    }
  };

  return (
    <View style={styles.container}>
      {sortedSessionData.length > 0 ? (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {sortedSessionData.map((session, index) => (
        
              <MainContainer_Header_ExerciseItem
                title={`${type.charAt(0).toUpperCase() + type.slice(1)}`}
                exercises={session.exercises}
                time={session.time}
                onClick={() => handleItemClick(session)}
          
              
                
                Ondelete={() => handleDeleteTraining(session.id)}
                onEdit={handleEdit}
                onCopy={() => handleCopy(session.id)}
              />
    
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No {type} activities found for {moment(selectedDate).format('MMM D, YYYY')}</Text>
        </View>
      )}
    </View>
  );
};

// Updated styles for the WorkoutLayout component
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  scrollView: {
    width: '100%',
    marginBottom: 55
  },
  scrollContent: {
    paddingBottom: 20, // Reduced padding to avoid extra space
    alignItems: 'center',
  },
  sessionContainer: {
    width: '100%',
    marginBottom: 15,
    alignItems: 'center',
  },
  noDataContainer: {
    padding: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#555',
  }
});

export default RecoveryLayout;