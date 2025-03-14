import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import MainContainer_Header_ExerciseItem from './MainContainer_Header_ExerciseItem';
import {
  useUserWorkoutContext,
  useUserRecoveryContext,
  useUserCardioContext,
} from '../context/UserContexts';
import {useDetails} from '../context/DeatailsContext';
import moment from 'moment';
import {deleteDoc, doc} from '@react-native-firebase/firestore';
import {COLLECTIONS} from '../firebase/collections';
import {FirestoreDB} from '../firebase/firebase_client';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import CopyDateModal from './CopyDateModal'; // Import the new component
import EditModal from './EditModal';

const WorkoutLayout = props => {
  const [CopyModal, setCopyModal] = useState(false);
  const [selected, setselected] = useState(false);
  const {workoutData, refresh, setRefresh} = useUserWorkoutContext();
  const {recoveryData} = useUserRecoveryContext();
  const {cardioData} = useUserCardioContext();
  const {parentIds, subCategories} = useDetails();
  const [editVisible, seteditVisible] = useState(false);
  const [copyModalVisible, setCopyModalVisible] = useState(false);
  const [selectedSessionToCopy, setSelectedSessionToCopy] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  console.log(workoutData, 'workoutDataworkoutDataworkoutData');
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

  const handleCopyConfirm = date => {
    console.log(selectedSessionToCopy , "selectedSessionToCopy", date)
    // if (selectedSessionToCopy && date) {
    //   console.log(date,"datedatedate",selectedSessionToCopy)


    //   // console.log(
    //   //   `Copying session ${selectedSessionToCopy.id} to date: ${moment(
    //   //     date,
    //   //   ).format('YYYY-MM-DD')}`,
    //   // );
    //   // Implement your copy logic here

    //   // Reset state
    //   setSelectedSessionToCopy(null);
    // }
  };

  const dataSource = getData();

  const handleDeleteTraining = async id => {
    try {
      const cardioDoc = doc(FirestoreDB, COLLECTIONS.DATA, id);
      await deleteDoc(cardioDoc);
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error deleting training: ', error);
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
            ? moment.unix(item.createdAt.seconds).format('YYYY-MM-DD HH:mm:ss')
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

    return (
      itemDate.isSameOrAfter(compareDateStart) &&
      itemDate.isSameOrBefore(compareDateEnd)
    );
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
    return filteredData
      .map(item => {
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
            const exerciseName = getExerciseName(
              exercise.subCategory,
              exercise.exerciseName,
            );

            // Create sets array based on reps and weights arrays
            const setsArray = [];
            if (
              Array.isArray(exercise.reps) &&
              Array.isArray(exercise.weights)
            ) {
              const setCount = Math.min(
                exercise.reps.length,
                exercise.weights.length,
              );

              for (let i = 0; i < setCount; i++) {
                setsArray.push({
                  number: String(i + 1),
                  weight: `${exercise.reps[i] || 0} × ${
                    exercise.weights[i] || 0
                  }kg`,
                });
              }
            }

            exercises.push({
              name: exerciseName || 'Unnamed Exercise',
              sets: setsArray,
            });
          });
        } else if (type === 'recovery') {
          // Transform recovery data
          item.data.forEach(recovery => {
            const recoveryName =
              getExerciseName(recovery.subCategory, recovery.name) ||
              'Recovery Activity';

            // For recovery, we'll show time/duration and intensity
            const setsArray = [
              {
                number: '1',
                weight: `${recovery.time || '0'} min, Intensity: ${
                  recovery.intensity || 'N/A'
                }`,
              },
            ];

            exercises.push({
              name: recoveryName,
              sets: setsArray,
            });
          });
        } else if (type === 'cardio') {
          // Transform cardio data to match web display format
          item.data.forEach(cardio => {
            const cardioName =
              getExerciseName(cardio.subCategory, cardio.name) ||
              'Cardio Activity';

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
                weight: `${cardio.speed || 'N/A'}, ${
                  cardio.incline || '0%'
                } Incline`,
              },
            ];

            // Add location if available
            if (cardio.location) {
              setsArray[0].location = cardio.location;
            }

            exercises.push({
              name: cardioName,
              duration: durationText,
              sets: setsArray,
            });
          });
        }

        return {
          time: timeString,
          exercises: exercises,
          id: item.id || `${type}-${timestamp?.valueOf() || Date.now()}`,
          originalData: item, // Store the original item for use when clicked
          name: item.name || 'Workout',
        };
      })
      .filter(Boolean); // Remove any null entries
  };

  const _chooseDate = () => {};

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
  const handleItemClick = session => {
    // If onSelectItem prop exists, call it with the clicked item's original data
    if (props.onSelectItem && session.originalData) {
      props.onSelectItem(session.originalData);
    }
  };

  const handleEdit = (sessionId) => {
    setCurrentSessionId(sessionId);
    seteditVisible(true);
  };

  const handleCopy = sessionId => {
    const sessionToCopy = sortedSessionData.find(
      session => session.id === sessionId,
    );

    if (sessionToCopy) {
      setSelectedSessionToCopy(sessionToCopy);
      setCopyModalVisible(true);
    }
  };

  const renderItem = ({item: session}) => {
    return (
      <>
        <MainContainer_Header_ExerciseItem
          onClick={() => handleItemClick(session)}
          title={session.name || type}
          exercises={session.exercises}
          time={session.time}
          Ondelete={() => handleDeleteTraining(session.id)}
          onEdit={() => handleEdit(session.id)}
          onCopy={() => handleCopy(session.id)}
          type={type}
          session={session}
        />
        {currentSessionId === session.id && (
          <EditModal
            type={type}
            id={session.id}
            name={session.name}
            parent={parentIds.Workout}
            visible={editVisible}
            onSave={() => {
              setRefresh(!refresh);
              seteditVisible(false);
            }}
          />
        )}
      </>
    );
  };

  const ListEmptyComponent = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataText}>
        No {type} activities found for{' '}
        {moment(selectedDate).format('MMM D, YYYY')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
      
        data={sortedSessionData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        // contentContainerStyle={styles.scrollContent}
        ListEmptyComponent={ListEmptyComponent}
        style={styles.scrollView}
      />
      <CopyDateModal
        visible={copyModalVisible}
        onClose={() => setCopyModalVisible(false)}
        onCopy={handleCopyConfirm}
      />
      <Modal
        visible={CopyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setCopyModal(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            {/* Title */}
            <Text style={styles.title}>Date</Text>

            {/* Message */}
            <TouchableOpacity onPress={_chooseDate}>
              <Text style={styles.message}>Choose Date</Text>
            </TouchableOpacity>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setCopyModal(false)}>
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.copyButton}  >
                <Text style={styles.copyText}>COPY</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Updated styles for the WorkoutLayout component - kept the same as original
const styles = StyleSheet.create({
    container: {
    width: '100%',
    flex: 1,
    
  },
  scrollView: {
    width: '100%',
    marginBottom: 55,
  },
  scrollContent: {
    paddingBottom: 20, // Reduced padding to avoid extra space
    
    // alignItems: 'center',
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
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
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
  saveButton: {
    flex: 1,
    backgroundColor: '#00E5FF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  cancelText: {
    fontWeight: 'bold',
  },
  copyButton: {
    flex: 1,
    backgroundColor: '#00E5FF',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 5,
  },
  copyText: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default WorkoutLayout;
