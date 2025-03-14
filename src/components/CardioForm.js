import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {Button, Text} from '@rneui/themed';
import {Dropdown} from 'react-native-element-dropdown';
import Down from '../assets/images/down.svg';
import Summary from './Summary';
import { useUserDetailsContext } from '../context/UserDetailsContext';
import { useDetails } from '../context/DeatailsContext';
import {
  collection,
  addDoc,
  updateDoc,
  doc
} from '@react-native-firebase/firestore';
import { COLLECTIONS } from '../firebase/collections';
import { FirestoreDB } from '../firebase/firebase_client';


const CardioForm = ({onSave, onCancel, cardioData}) => {
  // State for form fields
  const [category, setCategory] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [duration, setDuration] = useState('');
  const [isSaveCardioDisabled, setisSaveCardioDisabled] = useState(true)
  const getCurrentTime = () => {
    const now = new Date();
    return {
      hours: now.getHours().toString().padStart(2, '0'),
      minutes: now.getMinutes().toString().padStart(2, '0'),
    };
  };
  const currentTime = getCurrentTime();
  const [hours, setHours] = useState(currentTime.hours);
  const [minutes, setMinutes] = useState(currentTime.minutes);
  const [intensity, setIntensity] = useState('');
  const [cardioItems, setCardioItems] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const { categories, subCategories, parentIds } = useDetails();
  const { userDetails } = useUserDetailsContext();
  const [rounds, setRounds] = useState('');
  const [location, setLocation] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [isItemEditMode, setIsItemEditMode] = useState(false);
  const [isIntakeEditMode, setIsIntakeEditMode] = useState(false);

  // Debug logging for cardioItems to track intensity/speed values
  useEffect(() => {
    if (cardioItems.length > 0) {
      console.log('Current cardioItems:', cardioItems);
      // Check if speed property exists and has values
      const hasSpeed = cardioItems.some(item => item.speed && item.speed.length > 0);
      console.log('Has speed values:', hasSpeed);
    }
  }, [cardioItems]);

  useEffect(() => {
    console.log('🔥 parentIds:', parentIds);
    console.log('🔥 parentIds.Cardio:', parentIds?.Cardio);
  }, [parentIds]);

  // Check if we're in edit mode when component mounts
  useEffect(() => {
    if (cardioData) {
      // We're editing an entire cardio session
      if (cardioData.id) {
        setIsIntakeEditMode(true);
      }
      
      // Set the cardioItems for display in the summary
      if (cardioData.data && Array.isArray(cardioData.data)) {
        // Get cardio names for display
        const itemsWithNames = cardioData.data.map(item => {
          const exerciseName = getExerciseName(item.subCategory);
          
          // Debug log for each loaded item
          console.log('Loading item with speed:', item.speed);
          
          return {
            ...item,
            name: exerciseName || "Unknown Exercise"
          };
        });
        
        setCardioItems(itemsWithNames);
        console.log('Loaded cardioItems:', itemsWithNames);
        
        // Set time from createdAt timestamp
        if (cardioData.createdAt) {
          const timestamp = new Date(cardioData.createdAt.seconds * 1000);
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
  }, [cardioData]);
  
  // Helper function to get exercise name from subCategory ID
  function getExerciseName(subCategoryId) {
    if (!subCategoryId || !subCategories) return null;
    
    const subCategory = subCategories.find(sc => sc.id === subCategoryId);
    return subCategory ? subCategory.name : null;
  }

  useEffect(() => {
    if (categories?.length > 0 && parentIds?.Cardio) {
      const cardioCategories = categories
        .filter(cat => {
          const parentMatch = (cat.parentId?.trim() === parentIds.Cardio?.trim()) ||
            (cat.parent?.trim() === parentIds.Cardio?.trim());
          return parentMatch;
        })
        .map(cat => ({ label: cat.name, value: cat.id }))
        .sort((a, b) => a.label.localeCompare(b.label));

      console.log('Filtered Categories Count:', cardioCategories.length);
      setFilteredCategories(cardioCategories);
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
        .sort((a, b) => a.label.localeCompare(b.label));
      console.log('🔥 Filtered Exercises Count:', exercisesForCategory.length);
      setFilteredExercises(exercisesForCategory);
    } else {
      setFilteredExercises([]);
    }
  }, [category, subCategories]);

  const hoursData = Array.from({length: 24}, (_, i) => {
    const val = i.toString().padStart(2, '0');
    return {label: val, value: val};
  });

  const minutesData = Array.from({length: 60}, (_, i) => {
    const val = i.toString().padStart(2, '0');
    return {label: val, value: val};
  });

  // Custom dropdown render
  const renderDropdownItem = item => {
    return (
      <View style={styles.dropdownItem}>
        <Text style={styles.dropdownItemText}>{item.label}</Text>
      </View>
    );
  };

  const handleAddTemplate = () => {
    console.log('Add Template pressed');
  };

  const handleSaveTemplate = () => {
    console.log('Save Template pressed');
  };

  const handleDeleteCardio = (index) => {
    setCardioItems(prevItems => prevItems.filter((_, idx) => idx !== index));
  };

  // Handle clicking on a cardio item in the summary
  const handleSelectCardio = (item, index) => {
    console.log("Selected cardio item:", item);
    console.log("Item speed value:", item.speed); // Debug log for speed value
    setSelectedItemIndex(index);
    setIsItemEditMode(true);
    
    // Populate form with the selected item's data
    if (item) {
      setCategory(item.category);
      setExercise(item.subCategory);
      
      if (item.duration) {
        const [durationHours, durationMinutes] = item.duration.split(':');
        if (durationHours) setHours(durationHours);
        if (durationMinutes) setMinutes(durationMinutes);
      }
      
      // Debug before setting intensity
      console.log("Setting intensity to:", item.speed || '');
      setIntensity(item.speed || '');
      setRounds(item.incline || '');
      setLocation(item.location || '');
      setDuration(item.time || '');
    }
  };

  // Update an existing cardio item
  const handleUpdateCardio = () => {
    if (!category || !exercise) {
      console.log('Please select both category and exercise');
      return;
    }
  
    // Get names for display
    const exerciseName = filteredExercises.find(item => item.value === exercise)?.label || 'Unknown Exercise';
    
    // Debug log for intensity value before updating
    console.log("Current intensity value before update:", intensity);
    
    // Create updated cardio item
    const updatedCardioItem = {
      category,
      subCategory: exercise,
      name: exerciseName,
      duration: `${hours}:${minutes}`,
      speed: intensity,
      incline: rounds,
      location: location,
      time: duration
    };
    
    console.log("Updating cardio at index:", selectedItemIndex, "with:", updatedCardioItem);
    
    // Update the specific item in the array
    if (selectedItemIndex !== null && selectedItemIndex >= 0) {
      // Create a new array with the updated item
      const newItems = [...cardioItems];
      newItems[selectedItemIndex] = updatedCardioItem;
      
      // Set the state with the new array
      setCardioItems(newItems);
      
      console.log("Updated cardioItems:", newItems);
    }
    
    // Reset form fields after update
    setExercise(null);
    setIntensity('');
    setRounds('');
    setLocation('');
    setDuration('');
    setIsItemEditMode(false);
    setSelectedItemIndex(null);
  };

  const handleAddCardio = () => {
    if (!category || !exercise) {
      console.log('Please select both category and exercise');
      return;
    }
    // Get names for display
    const exerciseName = filteredExercises.find(item => item.value === exercise)?.label || 'Unknown Exercise';
    
    // Debug log for intensity value before adding
    console.log("Current intensity value before adding:", intensity);
    
    // Create cardio item
    const newCardioItem = {
      category,
      subCategory: exercise,
      name: exerciseName,
      duration: `${hours}:${minutes}`,
      speed: intensity,
      incline: rounds,
      location: location,
      time: duration
    };
    
    // Add to cardio items list
    setCardioItems(prevItems => [...prevItems, newCardioItem]);
    
    // Reset form fields
    setExercise(null);
    setIntensity('');
    setRounds('');
    setLocation('');
    setDuration('');
    setisSaveCardioDisabled(false)
    console.log('Cardio item added:', newCardioItem);
  };

  const handleSaveCardio = async () => {
    try {
      // Create date with selected time
      const currentDate = new Date();
      const cardioTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        parseInt(hours, 10),
        parseInt(minutes, 10),
        0
      );
      
      // Format data for Firebase
      const payload = {
        data: cardioItems.map(item => {
          // Debug log for each item being saved
          console.log("Saving item with speed:", item.speed);
          
          return {
            category: item.category,
            subCategory: item.subCategory,
            duration: item.duration,
            speed: item.speed, // Ensure speed is included
            incline: item.incline,
            location: item.location,
            time: item.time
          };
        }),
        // Keep the original timestamp if editing an intake
        createdAt: isIntakeEditMode && cardioData?.createdAt ? cardioData.createdAt : cardioTime,
        parent: parentIds.Cardio,
        username: userDetails?.username,
        template: null
      };
      
      // Debug log for final payload
      console.log("Final payload being saved:", JSON.stringify(payload));
      
      let docId;
      
      if (isIntakeEditMode && cardioData?.id) {
        // Update existing document if editing an intake
        const docRef = doc(FirestoreDB, COLLECTIONS.DATA, cardioData.id);
        await updateDoc(docRef, payload);
        docId = cardioData.id;
        console.log("Cardio intake updated with ID: ", docId);
      } else {
        // Create new document
        const dataCollection = collection(FirestoreDB, COLLECTIONS.DATA);
        const docRef = await addDoc(dataCollection, payload);
        docId = docRef.id;
        console.log("New cardio intake saved with ID: ", docId);
      }
      
      // Reset form
      setCardioItems([]);
      setCategory(null);
      setExercise(null);
      setIntensity('');
      setRounds('');
      setLocation('');
      setIsItemEditMode(false);
      setIsIntakeEditMode(false);
      setSelectedItemIndex(null);
      
      // Callback
      if (onSave) {
        onSave(docId);
      }
      
      console.log('Cardio data saved successfully');
    } catch (error) {
      console.error("Error saving cardio data:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* First Row: Category and Exercise */}
      <View style={styles.topRow}>
        <View style={styles.column}>
          <Text style={styles.label}>Category</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderText}
            selectedTextStyle={styles.selectedText}
            data={filteredCategories}
            labelField="label"
            valueField="value"
            placeholder="Select Category"
            value={category}
            onChange={item => setCategory(item.value)}
            renderItem={renderDropdownItem}
            renderRightIcon={() => <Down height={14} width={14} />}
          />
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>Exercise</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderText}
            selectedTextStyle={styles.selectedText}
            data={filteredExercises}
            labelField="label"
            valueField="value"
            placeholder="Select Exercise"
            value={exercise}
            onChange={item => setExercise(item.value)}
            renderItem={renderDropdownItem}
            renderRightIcon={() => <Down height={14} width={14} />}
          />
        </View>
      </View>

      {/* Second Row: Time, Time(min), Intensity, Rounds */}
      <View style={styles.middleRow}>
        <View style={styles.timeColumn}>
          <Text style={styles.label}>Time</Text>
          <View style={styles.timeContainer}>
            <Dropdown
              style={styles.timeDropdown}
              placeholderStyle={styles.selectedText}
              selectedTextStyle={styles.selectedText}
              data={hoursData}
              labelField="label"
              valueField="value"
              value={hours}
              onChange={item => setHours(item.value)}
              renderItem={renderDropdownItem}
              renderRightIcon={() => <Down height={10} width={10} />}
            />
            <Dropdown
              style={styles.timeDropdown}
              placeholderStyle={styles.selectedText}
              selectedTextStyle={styles.selectedText}
              data={minutesData}
              labelField="label"
              valueField="value"
              value={minutes}
              onChange={item => setMinutes(item.value)}
              renderItem={renderDropdownItem}
              renderRightIcon={() => <Down height={10} width={10} />}
            />
          </View>
        </View>

        <View style={styles.rightColumns}>
          <View style={styles.smallColumn}>
            <Text style={styles.label}>Time</Text>
            <View style={styles.minContainer}>
              <TextInput
                style={styles.minInput}
                value={duration}
                onChangeText={setDuration}
                placeholder="min."
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.smallColumn}>
            <Text style={styles.label}>Speed</Text>
            <View style={styles.intensityContainer}>
              <TextInput
                style={styles.intensityInput}
                value={intensity}
                onChangeText={setIntensity}
                placeholder="km/h"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.smallColumn}>
            <Text style={styles.label}>Incline</Text>
            <View style={styles.roundsContainer}>
              <TextInput
                style={styles.roundsInput}
                value={rounds}
                onChangeText={setRounds}
                placeholder="%"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </View>

      {/* Buttons Row */}
      <View style={styles.buttonRow}>
        <Button
          onPress={handleAddTemplate}
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
          onPress={handleSaveTemplate}
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
          onPress={isItemEditMode ? handleUpdateCardio : handleAddCardio}
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
        title="Cardio Summary" 
        cardio={cardioItems}
        onDeleteCardio={handleDeleteCardio} 
        onSelectCardio={handleSelectCardio}
      />

      {/* Bottom Buttons */}
      <View style={[styles.bottomButtonRow,{
        justifyContent:'center'
      }]}>
        {/* <Button
          onPress={onCancel}
          buttonStyle={[
            styles.buttonStyle,
            {
              backgroundColor: '#fff',
            },
          ]}
          title="Cancel"
          titleStyle={styles.buttonTextStyle}
        /> */}
        <Button
        disabled={isSaveCardioDisabled}
          onPress={handleSaveCardio}
          buttonStyle={[styles.buttonStyle]}
          title={isIntakeEditMode ? "UPDATE CARDIO" : "SAVE Cardio"}
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
    marginBottom: 15,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%',
  },
  timeColumn: {
    width: '30%',
  },
  rightColumns: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
  },
  smallColumn: {
    // width: '31%',
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: 'white',
    marginBottom: 3,
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
  placeholderText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '700',
  },
  selectedText: {
    color: '#000',
    fontSize: 12,
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
    justifyContent: 'space-between',
  },
  timeDropdown: {
    height: 30,
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  minContainer: {
    height: 30,
  },
  minInput: {
    height: 30,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'center',
    fontSize: 14,
    width: 55,
  },
  intensityContainer: {
    height: 50,
  },
  intensityInput: {
    height: 30,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    width: 55,
  },
  roundsContainer: {
    height: 50,
  },
  roundsInput: {
    height: 30,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    width: 55,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  templateButton: {
    width: 163,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  templateButtonText: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addButton: {
    width: 163,
    height: 30,
    backgroundColor: '#5acef7',
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  bottomButtonRow: {
    position: 'absolute',
    bottom: 21,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf:'center'
  },
});

export default CardioForm;