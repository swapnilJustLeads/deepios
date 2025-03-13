import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import MainContainer_Header_ExerciseItem from './MainContainer_Header_ExerciseItem';
import { useUserWorkoutContext, useUserRecoveryContext, useUserCardioContext } from '../context/UserContexts';
import { useDetails } from '../context/DeatailsContext';
import moment from 'moment';
import { deleteDoc, doc } from '@react-native-firebase/firestore';
import { COLLECTIONS } from '../firebase/collections';
import { FirestoreDB } from '../firebase/firebase_client';
import CalendarUI from './CalendarUI';

const WorkoutLayout = (props) => {
  const [CopyModal, setCopyModal] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});
  const [selected, setselected] = useState(false);
  const [selectedCopyDate, setSelectedCopyDate] = useState(null);
  const [calendarPosition, setCalendarPosition] = useState({ x: 0, y: 0 });

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

  const handleDeleteTraining = async (id) => {
    try {
      const cardioDoc = doc(FirestoreDB, COLLECTIONS.DATA, id);
      await deleteDoc(cardioDoc);
      console.log('delete')
      // toast.dismiss(t);
      // toast.success("Training deleted successfully!");
      // handleRefresh();
      // handleOnCopy();
    } catch (error) {
      // toast.dismiss(t);
      console.error("Error deleting training: ", error);
      // toast.error("Failed to delete training.");
    }
  };

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

  const _chooseDate = (event) => {
    // Get the button position to place the calendar below it
    event.target.measure((x, y, width, height, pageX, pageY) => {
      setCalendarPosition({ x: pageX, y: pageY + height });
      setCalendarVisible(!calendarVisible);
    });
  };

  const handleDayPress = (day) => {
    // Toggle selection when a date is pressed
    const selectedDate = day.dateString;
    const updatedSelectedDates = { ...selectedDates };
    
    if (updatedSelectedDates[selectedDate]) {
      // If already selected, unselect it
      delete updatedSelectedDates[selectedDate];
    } else {
      // Otherwise select it with a blue background
      updatedSelectedDates[selectedDate] = {
        selected: true,
        selectedColor: '#00E5FF',
      };
    }
    
    setSelectedDates(updatedSelectedDates);
  };

  const handleCalendarSelection = (date) => {
    // Format the date to YYYY-MM-DD
    const formattedDate = moment(date).format('YYYY-MM-DD');
    setSelectedCopyDate(formattedDate);
    
    // Create a new selectedDates object with just this date
    const newSelectedDates = {
      [formattedDate]: {
        selected: true,
        selectedColor: '#00E5FF',
      }
    };
    
    setSelectedDates(newSelectedDates);
  };

  const handleConfirmDates = () => {
    setCalendarVisible(false);
    // You can use selectedDates object here to do whatever you need with the selected dates
    console.log('Selected dates:', Object.keys(selectedDates));
    
    // Additional logic for copying to the selected date can go here
  };

  const handleCopyConfirm = () => {
    if (selectedCopyDate) {
      console.log(`Copying to date: ${selectedCopyDate}`);
      // Implement your copy logic here
    }
    
    // Close the modals
    setCalendarVisible(false);
    setCopyModal(false);
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

  const handleEdit = (session) => {
    // Edit functionality
  };

  const handleCopy = (session) => {
    // Reset selected dates when opening copy modal
    setSelectedDates({});
    setSelectedCopyDate(null);
    setCalendarVisible(false); // Make sure calendar is hidden initially
    setCopyModal(true);
  };

  return (
    <View style={styles.container}>
      {sortedSessionData.length > 0 ? (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {sortedSessionData.map((session, index) => (
            <MainContainer_Header_ExerciseItem
              key={`${session.id}-${index}`}
              onClick={() => handleItemClick(session)}
              title={`${type.charAt(0).toUpperCase() + type.slice(1)}`}
              exercises={session.exercises}
              time={session.time}
              Ondelete={() => handleDeleteTraining(session.id)}
              onEdit={() => handleEdit(session.id)}
              onCopy={() => handleCopy(session.id)}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No {type} activities found for {moment(selectedDate).format('MMM D, YYYY')}</Text>
        </View>
      )}

      {/* Copy Modal with integrated calendar */}
      <Modal
  visible={CopyModal}
  transparent
  animationType="fade"
  onRequestClose={() => {
    setCalendarVisible(false);
    setCopyModal(false);
  }}
>
  <View style={styles.overlay}>
    <View style={styles.modalContainer}>
      {/* Title */}
      <Text style={styles.title}>Date</Text>

      {/* Choose Date Button */}
      <TouchableOpacity 
        onPress={_chooseDate}
        activeOpacity={0.7}
        style={styles.chooseDateButton}>
        <Text style={styles.message}>Choose Date</Text>
      </TouchableOpacity>
      
      {/* Selected Date Display - show only if a date is selected */}
      {selectedCopyDate && (
        <Text style={styles.selectedDateText}>
          {moment(selectedCopyDate).format('MMM D, YYYY')}
        </Text>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => {
            setCalendarVisible(false);
            setCopyModal(false);
          }}
        >
          <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.copyButton,
            // Disable if no date selected
            !selectedCopyDate && styles.disabledButton
          ]}
          onPress={handleCopyConfirm}
          disabled={!selectedCopyDate}
        >
          <Text style={styles.copyText}>COPY</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
{calendarVisible && (
  <View 
    style={[
      styles.calendarOverlay,
      { 
        position: 'absolute',
        top: calendarPosition.y,
        left: calendarPosition.x
      }
    ]}
  >
    <View style={styles.calendarCard}>
      <CalendarUI 
        onSelectDate={(date) => {
          handleCalendarSelection(date);
          setCalendarVisible(false);
        }}
        initialDate={selectedCopyDate ? new Date(selectedCopyDate) : new Date()}
      />
      
      <TouchableOpacity 
        style={styles.closeCalendarButton}
        onPress={() => setCalendarVisible(false)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
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
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300, // Increased width to fit calendar
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  message: {
    fontSize: 16,
    color: '#00E5FF',
    marginBottom: 5,
    textDecorationLine: 'underline',
  },
  chooseDateButton: {
    marginBottom: 10,
  },
  selectedDateText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 10,
    fontWeight: '500',
  },
  calendarWrapper: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 5,
  },
  cancelText: {
    color: '#000',
    fontWeight: '600',
  },
  copyButton: {
    flex: 1,
    backgroundColor: '#00E5FF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 5,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  copyText: {
    color: '#FFF',
    fontWeight: '600',
  },
  calendarOverlay: {
    // Position will be set dynamically
    zIndex: 1000, // Make sure it appears on top
  },
  calendarCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  
  },
  closeCalendarButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginTop: 8,
  },
  closeButtonText: {
    color: '#333',
    fontWeight: '500',
  },
});

export default WorkoutLayout;