import React, { useState, useMemo, useEffect } from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {Button, Text} from '@rneui/themed';
import {Dropdown} from 'react-native-element-dropdown';
import {
  collection,
  addDoc,
} from '@react-native-firebase/firestore';
import { COLLECTIONS } from '../firebase/collections';
import { FirestoreDB } from '../firebase/firebase_client';
import Down from '../assets/images/down.svg';
import Summary from './Summary';
import { useUserDetailsContext } from '../context/UserDetailsContext';
import { useDetails } from '../context/DeatailsContext';


const RecoveryForm = ({onSave}) => {
  // State for form fields
  const [category, setCategory] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [hours, setHours] = useState('09');
  const [minutes, setMinutes] = useState('35');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('1-10');
  const [rounds, setRounds] = useState('1-10');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const { categories, subCategories, parentIds } = useDetails();
  const { userDetails } = useUserDetailsContext();
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [recoveryItems, setRecoveryItems] = useState([]);

  useEffect(() => {
    console.log('🔥 parentIds at recovery:', parentIds);
    console.log('🔥 parentIds.Workout:', parentIds?.Recovery);
  }, [parentIds]);
  // Sample data for dropdowns
  useEffect(() => {
    if (categories?.length > 0 && parentIds?.Recovery) {
      // Your existing filter code remains the same
      const recoveryCategories = categories
        .filter(cat => {
          const parentMatch = (cat.parentId?.trim() === parentIds.Recovery?.trim()) ||
            (cat.parent?.trim() === parentIds.Recovery?.trim());
          return parentMatch;
        })
        .map(cat => ({ label: cat.name, value: cat.id }))
        // Add sort here - sort alphabetically by label (name)
        .sort((a, b) => a.label.localeCompare(b.label));

      console.log('Filtered Categories Count:', recoveryCategories.length);
      setFilteredCategories(recoveryCategories);
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

  const handleAdd = () => {
    console.log('Add pressed');
    // Collect and send all form data here
    const formData = {
      category,
      exercise,
      time: `${hours}:${minutes}`,
      intensity,
      rounds,
    };
    console.log('Form data:', formData);
  };

    // Delete recovery item
    const handleDeleteRecovery = (index) => {
      setRecoveryItems(prevItems => prevItems.filter((_, idx) => idx !== index));
    };
// Add recovery item

const handleAddRecovery = () => {
  if (!category || !exercise) {
    console.log('Please select both category and exercise');
    return;
  }

  // Get names for display
  const exerciseName = filteredExercises.find(item => item.value === exercise)?.label || 'Unknown Exercise';
  
  // Create recovery item
  const newRecoveryItem = {
    category,
    subCategory: exercise,
    name: exerciseName,
    time: duration,
    intensity,
    rounds
  };
  
  // Add to recovery items list
  setRecoveryItems(prevItems => [...prevItems, newRecoveryItem]);
  
  // Reset form fields
  setExercise(null);
  setIntensity('1-10');
  setRounds('1-10');
  
  console.log('Recovery item added:', newRecoveryItem);
};
    // Save all recovery items
    const handleSaveRecovery = async () => {
      try {
        // Create date with selected time
        const currentDate = new Date();
        const recoveryTime = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          parseInt(hours, 10),
          parseInt(minutes, 10),
          0
        );
        
        // Format data for Firebase
        const payload = {
          data: recoveryItems.map(item => ({
            category: item.category,
            subCategory: item.subCategory,
            time: item.time,
            intensity: item.intensity,
            rounds: item.rounds
          })),
          createdAt: recoveryTime,
          parent: parentIds.Recovery,
          username: userDetails?.username,
          template: null
        };
        
        // Save to Firestore
        const dataCollection = collection(FirestoreDB, COLLECTIONS.DATA);
        const docRef = await addDoc(dataCollection, payload);
        console.log("Recovery data saved with ID: ", docRef.id);
        
        // Reset form
        setRecoveryItems([]);
        setCategory(null);
        setExercise(null);
        setIntensity('1-10');
        setRounds('1-10');
        
        // Callback
        if (onSave) {
          onSave(docRef.id);
        }
        
        console.log('Recovery data saved successfully');
      } catch (error) {
        console.error("Error saving recovery data:", error);
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
            placeholder="Choose"
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
            placeholder="Choose"
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
                editable={true}
                value={duration}
                onChangeText={setDuration}
                placeholder="min."
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.smallColumn}>
            <Text style={styles.label}>Intensity</Text>
            <View style={styles.intensityContainer}>
              <TextInput
                style={styles.intensityInput}
                value={intensity}
                onChangeText={setIntensity}
              />
            </View>
          </View>

          <View style={styles.smallColumn}>
            <Text style={styles.label}>Rounds</Text>
            <View style={styles.roundsContainer}>
              <TextInput
                style={styles.roundsInput}
                value={rounds}
                onChangeText={setRounds}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Buttons Row */}
      <View style={styles.buttonRow}>
        <Button
      
          // onPress={handleAddRecovery}
          buttonStyle={[
            styles.buttonStyle,
            {
              backgroundColor: '#fff',
            },
          ]}
          title="Add Templete"
          titleStyle={styles.buttonTextStyle}
        />
        <Button
          // containerStyle={{marginLeft: 21}}
          // onPress={handleAdd}
          buttonStyle={[
            styles.buttonStyle,
            {
              backgroundColor: '#fff',
            },
          ]}
          title="Save Templete"
          titleStyle={styles.buttonTextStyle}
        />
        <Button
          // containerStyle={{marginLeft: 21}}
          onPress={handleAddRecovery}
          buttonStyle={[styles.buttonStyle]}
          title="ADD"
          titleStyle={styles.buttonTextStyle}
        />
      </View>
      <Summary 
  title="Recovery Summary" 
   recovery={recoveryItems}
  // onDeleteRecovery={handleDeleteRecovery} 
/>
<View style={styles.bottomButton}>
            <Button
              onPress={handleSaveRecovery}
              buttonStyle={styles.buttonStyle}
              title="Save"
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
    flex:1
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
    marginBottom: 8,
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
    // width:36
  },
  minInput: {
    height: 30,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'center',
    fontSize: 14,
    width: 46,
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
  bottomButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom:21
  }
});

export default RecoveryForm;
