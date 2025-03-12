import React, { useState, useMemo, useEffect } from 'react';
import { COLLECTIONS } from '../firebase/collections';
import {
  collection,
  addDoc,
  updateDoc,
  doc
} from '@react-native-firebase/firestore';
import { FirestoreDB } from '../firebase/firebase_client';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { Dropdown } from 'react-native-element-dropdown';
import { useUserDetailsContext } from '../context/UserDetailsContext';
import CustomDropdown from './CustomDropdown';
import { useDetails } from '../context/DeatailsContext';
import Down from '../assets/images/down.svg';
import Summary from './Summary';

const WorkoutForm = ({ onSave, onCancel, workoutData }) => {
  // State for form fields
  const [category, setCategory] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [exercisesList, setExercisesList] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: []
  });
  const [sets, setSets] = useState(1);
  const [reps, setReps] = useState(Array(sets).fill(''));
  const [weights, setWeights] = useState(Array(sets).fill(''));
  const [hours, setHours] = useState('07');
  const [minutes, setMinutes] = useState('19');
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [isItemEditMode, setIsItemEditMode] = useState(false);
  const [isIntakeEditMode, setIsIntakeEditMode] = useState(false);
  
  // 🔹 Get data from Context
  const { categories, subCategories, parentIds } = useDetails();
  const { userDetails } = useUserDetailsContext();
  const [filteredCategories, setFilteredCategories] = useState([]);
  
  useEffect(() => {
    console.log('🔥 parentIds:', parentIds);
    console.log('🔥 parentIds.Workout:', parentIds?.Workout);
  }, [parentIds]);

  // Check if we're in edit mode when component mounts
  useEffect(() => {
    if (workoutData) {
      // We're editing an entire workout session
      if (workoutData.id) {
        setIsIntakeEditMode(true);
      }
      
      // Set the exercisesList for display in the summary
      if (workoutData.data && Array.isArray(workoutData.data)) {
        // Get exercise names for display
        const itemsWithNames = workoutData.data.map(item => {
          const exerciseName = getExerciseName(item.subCategory);
          
          // Create sets array for display in Summary
          const setsArray = [];
          if (Array.isArray(item.reps) && Array.isArray(item.weights)) {
            const setCount = Math.min(item.reps.length, item.weights.length);
            
            for (let i = 0; i < setCount; i++) {
              setsArray.push({
                reps: parseInt(item.reps[i] || '0', 10),
                weight: parseFloat(item.weights[i] || '0')
              });
            }
          }
          
          return {
            category: item.category,
            subCategory: item.subCategory,
            name: exerciseName || "Unknown Exercise",
            sets: setsArray,
            reps: item.reps || [],
            weights: item.weights || []
          };
        });
        
        setExercisesList(itemsWithNames);
        
        // Set time from createdAt timestamp
        if (workoutData.createdAt) {
          const timestamp = new Date(workoutData.createdAt.seconds * 1000);
          setHours(String(timestamp.getHours()).padStart(2, '0'));
          setMinutes(String(timestamp.getMinutes()).padStart(2, '0'));
        }
      }
    } else {
      // Reset if no data
      setIsIntakeEditMode(false);
      setIsItemEditMode(false);
    }
    
    // Cleanup function when component unmounts
    return () => {
      setIsItemEditMode(false);
      setIsIntakeEditMode(false);
    };
  }, [workoutData]);
  
  // Helper function to get exercise name from subCategory ID
  function getExerciseName(subCategoryId) {
    if (!subCategoryId || !subCategories) return null;
    
    const subCategory = subCategories.find(sc => sc.id === subCategoryId);
    return subCategory ? subCategory.name : null;
  }

  useEffect(() => {
    if (categories?.length > 0 && parentIds?.Workout) {
      // Your existing filter code remains the same
      const workoutCategories = categories
        .filter(cat => {
          const parentMatch = (cat.parentId?.trim() === parentIds.Workout?.trim()) ||
            (cat.parent?.trim() === parentIds.Workout?.trim());
          return parentMatch;
        })
        .map(cat => ({ label: cat.name, value: cat.id }))
        // Add sort here - sort alphabetically by label (name)
        .sort((a, b) => a.label.localeCompare(b.label));

      console.log('Filtered Categories Count:', workoutCategories.length);
      setFilteredCategories(workoutCategories);
    }
  }, [categories, parentIds]);


  useEffect(() => {
    if (subCategories?.length > 0 && category) {
      const exercisesForCategory = subCategories
        .filter(sub => {
          const match = sub.category?.trim() === category.trim();
          return match;
        })
        .map(sub => ({ label: sub.name, value: sub.id }))
        // Add sort here - sort alphabetically by label (name)
        .sort((a, b) => a.label.localeCompare(b.label));
      console.log('🔥 Filtered Exercises Count:', exercisesForCategory.length);
      setFilteredExercises(exercisesForCategory);
    } else {
      setFilteredExercises([]);
    }
  }, [category, subCategories]);


  // When sets change, dynamically adjust reps & weights
  useEffect(() => {
    setReps(prevReps => {
      const newReps = [...prevReps.slice(0, sets)];
      while (newReps.length < sets) newReps.push(''); // Add empty values if increasing sets
      return newReps;
    });

    setWeights(prevWeights => {
      const newWeights = [...prevWeights.slice(0, sets)];
      while (newWeights.length < sets) newWeights.push(''); // Add empty values if increasing sets
      return newWeights;
    });
  }, [sets]);

  // Handle clicking on an exercise item in the summary
  const handleSelectExercise = (item, index) => {
    console.log("Selected exercise item:", item);
    setSelectedItemIndex(index);
    setIsItemEditMode(true);
    
    // Populate form with the selected item's data
    if (item) {
      setCategory(item.category);
      setExercise(item.subCategory);
      
      // Set sets count based on reps/weights length
      const setsCount = Math.max(
        Array.isArray(item.reps) ? item.reps.length : 0,
        Array.isArray(item.weights) ? item.weights.length : 0
      );
      
      if (setsCount > 0) {
        setSets(setsCount);
        setReps(item.reps || Array(setsCount).fill(''));
        setWeights(item.weights || Array(setsCount).fill(''));
      }
    }
  };

  // Dropdown Data
  const setsData = Array.from({ length: 5 }, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() }));
  const hoursData = Array.from({ length: 24 }, (_, i) => ({ label: i.toString().padStart(2, '0'), value: i.toString().padStart(2, '0') }));
  const minutesData = Array.from({ length: 60 }, (_, i) => ({ label: i.toString().padStart(2, '0'), value: i.toString().padStart(2, '0') }));
  const repsData = Array.from({ length: 12 }, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString() }));

  const weightsData = [
    ...Array.from({ length: 50 }, (_, i) => {
      const value = (i + 1) * 0.5;
      const label = value % 1 === 0 ? value.toString() : value.toFixed(1);
      return {
        label: label,
        value: value.toString()
      };
    }),
    ...Array.from({ length: 275 }, (_, i) => {
      const value = i + 26;
      return {
        label: value.toString(),
        value: value.toString()
      };
    })
  ];

  // Update an existing exercise
  const handleUpdateExercise = () => {
    if (!category || !exercise) {
      console.log('Please select both category and exercise');
      return;
    }
  
    // Get the exercise name for display purposes
    const exerciseName = filteredExercises.find(item => item.value === exercise)?.label || 'Unknown Exercise';

    // Format the sets data as an array of objects with reps and weight properties
    const setsData = [];
    for (let i = 0; i < sets; i++) {
      setsData.push({
        reps: parseInt(reps[i] || '0', 10),
        weight: parseFloat(weights[i] || '0')
      });
    }

    // Create updated workout object
    const updatedWorkout = {
      category,
      subCategory: exercise,
      name: exerciseName,
      sets: setsData,
      reps: [...reps],
      weights: [...weights]
    };
    
    console.log("Updating exercise at index:", selectedItemIndex, "with:", updatedWorkout);
    
    // Update the specific item in the array
    if (selectedItemIndex !== null && selectedItemIndex >= 0) {
      // Create a new array with the updated item
      const newItems = [...exercisesList];
      newItems[selectedItemIndex] = updatedWorkout;
      
      // Set the state with the new array
      setExercisesList(newItems);
      
      console.log("Updated exercisesList:", newItems);
    }
    
    // Reset form fields after update
    setExercise(null);
    setSets(1);
    setReps(Array(1).fill(''));
    setWeights(Array(1).fill(''));
    setIsItemEditMode(false);
    setSelectedItemIndex(null);
  };

  // Modify your ADD button's onClick handler
  const handleAddExercise = () => {
    if (category && exercise) {
      // Get the exercise name for display purposes
      const exerciseName = filteredExercises.find(item => item.value === exercise)?.label || 'Unknown Exercise';

      // Format the sets data as an array of objects with reps and weight properties
      const setsData = [];
      for (let i = 0; i < sets; i++) {
        setsData.push({
          reps: parseInt(reps[i] || '0', 10),
          weight: parseFloat(weights[i] || '0')
        });
      }

      // Create workout object with necessary structure for Summary component
      const newWorkout = {
        category,               // Store category ID
        subCategory: exercise,  // Store exercise ID
        name: exerciseName,     // Add name for display in Summary
        sets: setsData,         // Format sets as an array of objects with reps and weight
        reps: [...reps],        // Keep original reps array for saving
        weights: [...weights]   // Keep original weights array for saving
      };

      // Add to exercises list
      setExercisesList(prevList => [...prevList, newWorkout]);

      // Reset form fields
      setExercise(null);
      setSets(1);
      setReps(Array(1).fill(''));
      setWeights(Array(1).fill(''));
    } else {
      console.log('Please select both category and exercise');
    }
  };

  // Delete exercise item
  const handleDeleteExercise = (index) => {
    setExercisesList(prevItems => prevItems.filter((_, idx) => idx !== index));
  };

  const handleSaveWorkout = async () => {
    try {
      // Create date object with selected time
      const currentDate = new Date();
      const workoutTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        parseInt(hours, 10),
        parseInt(minutes, 10),
        0
      );

      // Format workout data for Firebase - avoid undefined values
      const payload = {
        data: exercisesList.map(exercise => {
          // Create a clean object without undefined values
          const cleanItem = {};
          
          if (exercise.category) cleanItem.category = exercise.category;
          if (exercise.subCategory) cleanItem.subCategory = exercise.subCategory;
          if (exercise.sets && typeof exercise.sets.length === 'number') cleanItem.sets = exercise.sets.length;
          if (exercise.reps) cleanItem.reps = exercise.reps;
          if (exercise.weights) cleanItem.weights = exercise.weights;
          if (exercise.notes) cleanItem.notes = exercise.notes;
          
          return cleanItem;
        }),
        createdAt: isIntakeEditMode && workoutData?.createdAt ? workoutData.createdAt : workoutTime,
        parent: parentIds.Workout,
        username: userDetails?.username,
        template: null
      };

      let docId;
      
      if (isIntakeEditMode && workoutData?.id) {
        // Update existing document if editing an intake
        const docRef = doc(FirestoreDB, COLLECTIONS.DATA, workoutData.id);
        await updateDoc(docRef, payload);
        docId = workoutData.id;
        console.log("Workout intake updated with ID: ", docId);
      } else {
        // Create new document
        const dataCollection = collection(FirestoreDB, COLLECTIONS.DATA);
        const docRef = await addDoc(dataCollection, payload);
        docId = docRef.id;
        console.log("New workout saved with ID: ", docId);
      }

      // Clear form and show success
      setExercisesList([]);
      setCategory(null);
      setExercise(null);
      setSets(1);
      setReps(Array(1).fill(''));
      setWeights(Array(1).fill(''));
      setIsItemEditMode(false);
      setIsIntakeEditMode(false);
      
      // Success message
      console.log('Workout saved successfully');

      // Navigate back or to workout list
      if (onSave) {
        onSave(docId);
      }

    } catch (error) {
      console.error("Error saving workout: ", error);
      // Show error message
      console.log('Failed to save workout');
    }
  };
  
  // Update Specific Rep
  const updateRep = (index, value) => {
    const updatedReps = [...reps];
    updatedReps[index] = value;
    setReps(updatedReps);
  };

  // Update Specific Weight
  const updateWeight = (index, value) => {
    const updatedWeights = [...weights];
    updatedWeights[index] = value;
    setWeights(updatedWeights);
  };

  // Custom dropdown render
  const renderDropdownItem = item => {
    return (
      <View style={styles.dropdownItem}>
        <Text style={styles.dropdownItemText}>{item.label}</Text>
      </View>
    );
  };

  // Update reps and weights based on sets
  const updateFormArrays = newSets => {
    const setsNumber = parseInt(newSets, 10) || 0;

    // For reps, preserve existing values and fill new slots with '5'
    setReps(prevReps => {
      if (setsNumber <= 0) return [];
      const newReps = [...prevReps.slice(0, setsNumber)];
      while (newReps.length < setsNumber) {
        newReps.push('5');
      }
      return newReps;
    });

    // For weights, preserve existing values and fill new slots with '5'
    setWeights(prevWeights => {
      if (setsNumber <= 0) return [];
      const newWeights = [...prevWeights.slice(0, setsNumber)];
      while (newWeights.length < setsNumber) {
        newWeights.push('5');
      }
      return newWeights;
    });
  };

  return (
    <View style={styles.container}>
      {/* First Row: Category and Exercise */}
      <View style={styles.topRow}>
        <View style={styles.column}>
          <Text style={styles.label}>Category</Text>
          <CustomDropdown
            options={filteredCategories}
            value={category}
            onChange={(value) => {
              console.log('Selected category item:', { value });
              setCategory(value);
            }}
            placeholder="Choose"
            containerStyle={styles.dropdown}
            placeholderStyle={styles.placeholderText}
            selectedStyle={styles.selectedText}
            isBullet={true}
          />
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>Exercise</Text>
          <CustomDropdown
            options={filteredExercises}
            value={exercise}
            onChange={(value) => setExercise(value)}
            placeholder="Choose"
            containerStyle={styles.dropdown}
            placeholderStyle={styles.placeholderText}
            selectedStyle={styles.selectedText}
            isBullet={true}
          />
        </View>
      </View>

      {/* Second Row: Sets and Time */}
      <View style={styles.middleRow}>
        <View style={styles.setsColumn}>
          <Text style={styles.label}>Sets</Text>
          <CustomDropdown
            options={setsData}
            value={sets.toString()}
            onChange={(value) => setSets(parseInt(value))}
            placeholder="Sets"
            containerStyle={styles.setsDropdown}
            selectedStyle={styles.selectedText}
          />
        </View>

        <View style={styles.timeColumn}>
          <Text style={styles.label}>Time</Text>
          <View style={styles.timeContainer}>
            <CustomDropdown
              options={hoursData}
              value={hours}
              onChange={(value) => setHours(value)}
              placeholder="00"
              containerStyle={styles.timeDropdown}
              selectedStyle={styles.selectedText}
            />
            <CustomDropdown
              options={minutesData}
              value={minutes}
              onChange={(value) => setMinutes(value)}
              placeholder="00"
              containerStyle={styles.timeDropdown}
              selectedStyle={styles.selectedText}
            />
          </View>
        </View>
      </View>

      {/* Reps Row */}
      <View style={styles.repWeightSection}>
        <Text style={styles.label}>Reps</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.scrollableContainer}>
            {reps.map((rep, index) => (
              <CustomDropdown
                key={`rep-${index}`}
                options={repsData}
                value={rep}
                onChange={(value) => {
                  const newReps = [...reps];
                  newReps[index] = value;
                  setReps(newReps);
                }}
                placeholder=""
                containerStyle={styles.repWeightDropdown}
                selectedStyle={styles.selectedText}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Weights Row */}
      <View style={styles.repWeightSection}>
        <Text style={styles.label}>Weights</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.scrollableContainer}>
            {weights.map((weight, index) => (
              <CustomDropdown
                key={`weight-${index}`}
                options={weightsData}
                value={weight}
                onChange={(value) => {
                  const newWeights = [...weights];
                  newWeights[index] = value;
                  setWeights(newWeights);
                }}
                placeholder=""
                containerStyle={styles.repWeightDropdown}
                selectedStyle={styles.selectedText}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Buttons Row */}
      <View style={styles.buttonRow}>
        <Button
          onPress={() => console.log('Add Template pressed')}
          buttonStyle={[
            styles.buttonStyle,
            {
              backgroundColor: '#fff',
            },
          ]}
          title="Add Template"
          titleStyle={styles.buttonTextStyle}
        />
        <Button
          onPress={() => console.log('Save Template pressed')}
          buttonStyle={[
            styles.buttonStyle,
            {
              backgroundColor: '#fff',
            },
          ]}
          title="Save Template"
          titleStyle={styles.buttonTextStyle}
        />
        <Button
          onPress={isItemEditMode ? handleUpdateExercise : handleAddExercise}
          buttonStyle={[
            styles.buttonStyle,
            isItemEditMode && { backgroundColor: '#FFD700' } // Yellow for update mode
          ]}
          title={isItemEditMode ? "UPDATE" : "ADD"}
          titleStyle={styles.buttonTextStyle}
        />
      </View>
      
      {/* Summary Component */}
      <Summary 
        title="Workout Summary" 
        exercises={exercisesList} 
        onDeleteExercise={handleDeleteExercise}
        onSelectExercise={handleSelectExercise}
      />
      
      {/* Bottom Button */}
      <View style={styles.bottomButton}>
        <Button
          onPress={handleSaveWorkout}
          buttonStyle={styles.buttonStyle}
          title={isIntakeEditMode ? "UPDATE WORKOUT" : "SAVE WORKOUT"}
          titleStyle={styles.buttonTextStyle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#b0b0b0',
    borderRadius: 8,
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  middleRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  column: {
    width: '48%',
  },
  setsColumn: {
    // width: '30%',
  },
  timeColumn: {
    width: '65%',
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: 'white',
    marginBottom: 6,
    fontFamily: 'Inter',
  },
  dropdown: {
    height: 30,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingRight: 10,
    justifyContent: 'center',
  },
  setsDropdown: {
    height: 30,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    justifyContent: 'center',
    width: 55,
  },
  placeholderText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
  },
  selectedText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 6,
    // justifyContent: 'space-between',
  },
  timeDropdown: {
    height: 30,
    width: 51,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  repWeightSection: {
    marginBottom: 6,
  },
  scrollableContainer: {
    flexDirection: 'row',
  },
  repWeightDropdown: {
    height: 30,
    width: 55,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  buttonStyle: {
    width: 103,
    backgroundColor: '#00E5FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextStyle: {
    fontFamily: 'Inter',
    fontSize: 9,
    fontWeight: '900',
    color: '#000000',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  bottomButton: {
    position: 'absolute',
    bottom: 21,
    alignSelf: 'center',
  },
});

export default WorkoutForm;