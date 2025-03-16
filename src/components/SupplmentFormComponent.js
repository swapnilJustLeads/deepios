/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useState,useEffect} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {Button, Text, Input, Divider, Icon} from '@rneui/themed';
import {Dropdown} from 'react-native-element-dropdown';
import Down from '../assets/images/down.svg';
import { useUserDetailsContext } from '../context/UserDetailsContext';
import { useDetails } from '../context/DeatailsContext';
import {
  collection,
  addDoc,
  doc,
  updateDoc
} from '@react-native-firebase/firestore';
import { COLLECTIONS } from '../firebase/collections';
import { FirestoreDB } from '../firebase/firebase_client';
import Summary from './Summary';



const SupplmentFormComponent = ({onSave,supplementData}) => {
  // State for form fields
  const [category, setCategory] = useState(null);
  const [supplement, setSupplement] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [hours, setHours] = useState('13');
  const [minutes, setMinutes] = useState('06');
  const [liquid, setLiquid] = useState('');
  const [amount, setAmount] = useState('1-10');
  const [company, setCompany] = useState('');
  const [timing, setTiming] = useState(null);
  const { userDetails } = useUserDetailsContext();
    const [isEditMode, setIsEditMode] = useState(false);
    // Use two separate state variables for clarity
const [isItemEditMode, setIsItemEditMode] = useState(false);      // For individual supplement item editing
const [isIntakeEditMode, setIsIntakeEditMode] = useState(false);
    const [supplementItems, setSupplementItems] = useState([]);
  const { categories, subCategories, parentIds } = useDetails();
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    console.log('🔥 parentIds:', parentIds);
    console.log('🔥 parentIds.Workout:', parentIds?.Supplement);
  }, [parentIds]);
  // Fetch timing from data if available
  // useEffect(() => {
  //   const supplementData = props.supplementData; // Pass this as a prop
  //   if (supplementData && supplementData.data && supplementData.data.length > 0) {
  //     setTiming(supplementData.data[0].timing || null); // Set timing from data
  //   }
  // }, [props.supplementData]); // Run only when data changes
  useEffect(() => {
    if (supplementData) {
      // We have supplement data, so we're in some form of edit mode
      if (supplementData.id) {
        // If we have an ID, we're editing an entire intake
        setIsIntakeEditMode(true);
      }
      
      // Don't set isItemEditMode here - wait for user to select an item
      setIsItemEditMode(false);
      
      // Set the supplementItems for display in the summary
      if (supplementData.data && Array.isArray(supplementData.data)) {
        setSupplementItems(supplementData.data);
      }
    } else {
      // No supplementData, reset both edit modes
      setIsIntakeEditMode(false);
      setIsItemEditMode(false);
    }
    
    // Cleanup function when component unmounts
    return () => {
      setIsItemEditMode(false);
      setIsIntakeEditMode(false);
    };
  }, [supplementData]);
  
  useEffect(() => {
    if (categories?.length > 0 && parentIds?.Supplement) {
      // Your existing filter code remains the same
      const supplementCategories = categories
        .filter(cat => {
          const parentMatch = (cat.parentId?.trim() === parentIds.Supplement?.trim()) ||
            (cat.parent?.trim() === parentIds.Supplement?.trim());
          return parentMatch;
        })
        .map(cat => ({ label: cat.name, value: cat.id }))
        // Add sort here - sort alphabetically by label (name)
        .sort((a, b) => a.label.localeCompare(b.label));

      console.log('Filtered Categories Count:', supplementCategories.length);
      setFilteredCategories(supplementCategories);
    }
  }, [categories, parentIds]);


useEffect(() => {
  if (supplementData && supplementData.data && Array.isArray(supplementData.data)) {
    // Transform each item to ensure it has a name while preserving all other properties
    const transformedData = supplementData.data.map(item => {
      // Get supplement name from subCategory if needed
      const supplementName = getSupplementName(item.subCategory);
   // Return all existing data plus a name property
      return {
        ...item,  // Keep all existing properties
        name: item.name || supplementName || `Supplement (${item.amount || ''})`
      };
    });
setSupplementItems(transformedData);
    console.log("Setting supplement items:", transformedData);
  }
}, [supplementData]);

// Helper function to get supplement name from subCategory ID (using your context)
function getSupplementName(subCategoryId) {
  if (!subCategoryId || !subCategories) return null;
  
  const subCategory = subCategories.find(sc => sc.id === subCategoryId);
  return subCategory ? subCategory.name : null;
}

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
      console.log('🔥 Filtered Exercises Count:', exercisesForCategory);
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

  const timingData = [
    {label: 'Before meal', value: 'before_meal'},
    {label: 'With meal', value: 'with_meal'},
    {label: 'After meal', value: 'after_meal'},
    {label: 'Before sleep', value: 'before_sleep'},
  ];

  // Custom dropdown render
  const renderDropdownItem = item => {
    return (
      <View style={styles.dropdownItem}>
        <Text style={styles.dropdownItemText}>{item.label}</Text>
      </View>
    );
  };
  // Add supplement item
  const handleAddSupplement = () => {
    if (!category || !supplement) {
      console.log('Please select both category and supplement');
      return;
    }

    // Get names for display
    const supplementName = filteredExercises.find(item => item.value === supplement)?.label || 'Unknown Supplement';

    // Create supplement item
    const newSupplementItem = {
      category,
      subCategory: supplement,
      name: supplementName,
      time: `${hours}:${minutes}`,
      liquid,
      amount,
      company,
      timing: timing || '',
    };

  // If in edit mode, update the existing item
  if (isEditMode && selectedItemIndex !== null) {
    setSupplementItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[selectedItemIndex] = newSupplementItem;
      return updatedItems;
    });
    
    // Reset edit mode
    setIsEditMode(false);
    setSelectedItemIndex(null);
  } else {
    // Add new item if not in edit mode
    setSupplementItems(prevItems => [...prevItems, newSupplementItem]);
  }

    // Reset form fields
    setSupplement(null);
    setLiquid('');
    setAmount('1-10');
    setCompany('');

    console.log('Supplement item added:', newSupplementItem);
  };

  // Delete supplement item
  const handleDeleteSupplement = (index) => {
    setSupplementItems(prevItems => prevItems.filter((_, idx) => idx !== index));
  };

  // Save all supplement items
  // const handleSaveSupplement = async () => {
  //   try {
  //     // Create date with selected time
  //     const currentDate = new Date();
  //     const supplementTime = new Date(
  //       currentDate.getFullYear(),
  //       currentDate.getMonth(),
  //       currentDate.getDate(),
  //       parseInt(hours, 10),
  //       parseInt(minutes, 10),
  //       0
  //     );

  //     // Format data for Firebase
  //     const payload = {
  //       data: supplementItems.map(item => ({
  //         category: item.category,
  //         subCategory: item.subCategory,
  //         time: item.time,
  //         liquid: item.liquid,
  //         amount: item.amount,
  //         company: item.company,
  //         timing: item.timing,
  //       })),
  //       createdAt: supplementTime,
  //       parent: parentIds.Supplement,
  //       username: userDetails?.username,
  //       template: null,
  //     };

  //     // Save to Firestore
  //     const dataCollection = collection(FirestoreDB, COLLECTIONS.DATA);
  //     const docRef = await addDoc(dataCollection, payload);
  //     console.log('Supplement data saved with ID: ', docRef.id);

  //     // Reset form
  //     setSupplementItems([]);
  //     setCategory(null);
  //     setSupplement(null);
  //     setLiquid('');
  //     setAmount('1-10');
  //     setCompany('');
  //     setTiming(null);

  //     // Callback
  //     if (onSave) {
  //       onSave(docRef.id);
  //     }

  //     console.log('Supplement data saved successfully');
  //   } catch (error) {
  //     console.error('Error saving supplement data:', error);
  //   }
  // };
// In SupplmentFormComponent.js

const handleUpdateSupplementItem = () => {
  if (!category || !supplement) {
    console.log('Please select both category and supplement');
    return;
  }

  // Get names for display
  const supplementName = filteredExercises.find(item => item.value === supplement)?.label || 'Unknown Supplement';
  
  // Create updated supplement item
  const updatedItem = {
    category,
    subCategory: supplement,
    name: supplementName,
    time: `${hours}:${minutes}`,
    liquid,
    amount,
    company,
    timing: timing || ''
  };
  
  console.log("Updating supplement at index:", selectedItemIndex, "with:", updatedItem);
  
  // Update the specific item in the array
  if (selectedItemIndex !== null && selectedItemIndex >= 0) {
    // Create a new array with the updated item
    const newItems = [...supplementItems];
    newItems[selectedItemIndex] = updatedItem;
    
    // Set the state with the new array
    setSupplementItems(newItems);
    
    console.log("Updated supplementItems:", newItems);
  }
  
  // Reset form fields after update
  setSupplement(null);
  setLiquid('');
  setAmount('1-10');
  setCompany('');
  setTiming(null);
  setIsItemEditMode(false);
  setSelectedItemIndex(null);
};
  const handleSaveOrUpdate = async () => {
    try {
      // Create payload with the updated supplement items
      const payload = {
        data: supplementItems.map(item => ({
          category: item.category,
          subCategory: item.subCategory,
          time: item.time,
          liquid: item.liquid,
          amount: item.amount,
          company: item.company,
          timing: item.timing
        })),
        // Keep the original timestamp if editing an intake
        createdAt: supplementData?.createdAt || new Date(),
        parent: parentIds.Supplement,
        username: userDetails?.username,
        template: null
      };
      
      let docRef;
      
      if (isIntakeEditMode && supplementData.id) {
        // Update existing document if editing an intake
        docRef = doc(FirestoreDB, COLLECTIONS.DATA, supplementData.id);
        await updateDoc(docRef, payload);
        console.log("Supplement intake updated with ID: ", supplementData.id);
      } else {
        // Create new document
        const dataCollection = collection(FirestoreDB, COLLECTIONS.DATA);
        docRef = await addDoc(dataCollection, payload);
        console.log("New supplement intake saved with ID: ", docRef.id);
      }
      
      // Reset form
      setSupplementItems([]);
      setCategory(null);
      setSupplement(null);
      setLiquid('');
      setAmount('1-10');
      setCompany('');
      setTiming(null);
      setIsEditMode(false);
      setSelectedItemIndex(null);
      
      // Callback
      if (onSave) {
        onSave(docRef);
      }
    } catch (error) {
      console.error("Error saving/updating supplement data:", error);
    }
  };
  const handleSupplementSelect = (selectedItem,index) => {
    // Populate the form fields with the selected supplement's data
    if (selectedItem) {
      // Set category
      setSelectedItemIndex(index);
      setCategory(selectedItem.category);
      setIsItemEditMode(true);
      setSupplement(selectedItem.subCategory);
      
      // Parse time into hours and minutes if available
      if (selectedItem.time) {
        const [hoursValue, minutesValue] = selectedItem.time.split(':');
        setHours(hoursValue);
        setMinutes(minutesValue);
      }
      
      // Set other fields
      setLiquid(selectedItem.liquid || '');
      setAmount(selectedItem.amount || '1-10');
      setCompany(selectedItem.company || '');
      setTiming(selectedItem.timing || null);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.categoryRowView}>
        {/* Category Row */}
        <View style={styles.row}>
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
            iconStyle={styles.iconStyle}
            renderRightIcon={() => <Down height={21} width={21} />}
          />
        </View>

        {/* Supplement Row */}
        <View style={styles.row}>
          <Text style={styles.label}>Supplement</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderText}
            selectedTextStyle={styles.selectedText}
            data={filteredExercises}
            labelField="label"
            valueField="value"
            placeholder="Select Supplement"
            value={supplement}
            onChange={item => setSupplement(item.value)}
            renderItem={renderDropdownItem}
            iconStyle={styles.iconStyle}
            renderRightIcon={() => <Down height={21} width={21} />}
          />
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {/* Time Row */}
        <View style={styles.row}>
          <Text style={styles.label}>Time</Text>
          <View style={styles.timeContainer}>
            <Dropdown
              style={styles.timeDropdown}
              placeholderStyle={styles.placeholderText}
              selectedTextStyle={styles.selectedText}
              data={hoursData}
              labelField="label"
              valueField="value"
              placeholder="00"
              value={hours}
              onChange={item => setHours(item.value)}
              renderItem={renderDropdownItem}
              iconStyle={styles.iconStyle}
              renderRightIcon={() => <Down height={6} width={14} />}
            />
            <Dropdown
              style={styles.timeDropdown}
              placeholderStyle={styles.selectedText}
              selectedTextStyle={styles.selectedText}
              data={minutesData}
              labelField="label"
              valueField="value"
              placeholder="00"
              value={minutes}
              onChange={item => setMinutes(item.value)}
              renderItem={renderDropdownItem}
              iconStyle={styles.iconStyle}
              renderRightIcon={() => <Down height={6} width={14} />}
            />
          </View>
        </View>

        {/* Liquid and Amount Row */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginLeft: 15,
          }}>
          <View style={{width: '42%'}}>
            <Text style={styles.label}>Liquid</Text>
            <TextInput
              titleStyle={styles.titleStyle}
              style={styles.textInputLiquid}
              value={liquid}
              placeholderStyle={styles.textInputPlaceholder}
              onChangeText={setLiquid}
              placeholder="in ml /"
              placeholderTextColor="#888"
            />
          </View>
          <View style={{width: '42%', marginLeft: -18}}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.textInput1}
              value={amount}
              onChangeText={setAmount}
              placeholder="1-10"
              placeholderTextColor="#888"
            />
          </View>
        </View>
      </View>

      {/* Company Row */}
      <View style={styles.row}>
        <Text style={styles.label}>
          Company <Text style={styles.optionalText}>(Optional)</Text>
        </Text>
        <TextInput
          style={styles.textInput}
          value={company}
          onChangeText={setCompany}
          placeholder="ESN..."
          placeholderTextColor="#888"
        />
      </View>

      {/* Timing Row */}
      <View style={styles.row}>
        <Text style={styles.label}>Timing</Text>
        <Dropdown
          style={styles.dropdownTiming}
          placeholderStyle={styles.placeholderTextTimining}
          selectedTextStyle={styles.selectedText}
          data={timingData}
          labelField="label"
          valueField="value"
          placeholder="Select Timing"
          value={timing}
          onChange={item => setTiming(item.value)}
          renderItem={renderDropdownItem}
          iconStyle={styles.iconStyle}
          renderRightIcon={() => <Down height={6} width={14} />}
        />
      </View>

      {/* Button Row */}
      <View style={styles.buttonRow}>
      <Button
          // containerStyle={{marginLeft: 21}}
          // onPress={() => setshowForm(true)}
          buttonStyle={[
            styles.buttonStyle,{
              backgroundColor:'#fff',
            },

          ]}
          title="Add Templete"
          titleStyle={styles.buttonTextStyle}
        />
        <Button
          // containerStyle={{marginLeft: 21}}
          // onPress={() => setshowForm(true)}
          buttonStyle={[
            styles.buttonStyle,
            {
              backgroundColor:'#fff',
            },

          ]}
          title="Save Templete"
          titleStyle={styles.buttonTextStyle}
        />
     <Button
  onPress={isItemEditMode ? handleUpdateSupplementItem : handleAddSupplement}
  buttonStyle={[
    styles.buttonStyle,
    isItemEditMode && { backgroundColor: '#FFD700' }
  ]}
  title={isItemEditMode ? "UPDATE INTAKE" : "ADD INTAKE"}
  titleStyle={styles.buttonTextStyle}
/>
      </View>
        {/* Summary component */}
     <Summary 
  title="Supplement Summary" 
  supplement={supplementItems} // Always use the state variable
  onDeleteSupplement={handleDeleteSupplement} 
  onSelectSupplement={(item, index) => handleSupplementSelect(item, index)} 
/>
            <View style={styles.bottomButtonRow}>
            <Button
              containerStyle={{ marginLeft: 21 }}
              // onPress={() => setshowForm(true)}
              buttonStyle={[styles.buttonStyle, { backgroundColor: '#fff' }]}
              title="Delete"
              titleStyle={styles.buttonTextStyle}
            />
            <Button
             containerStyle={{ marginRight: 21 }}
             onPress={handleSaveOrUpdate}
             buttonStyle={[
               styles.buttonStyle,
               isIntakeEditMode && { backgroundColor: '#FF9500' }
             ]}
             title={isIntakeEditMode ? "UPDATE INTAKE" : "SAVE"}
             titleStyle={styles.buttonTextStyle}
            />
          </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    flex:1,
  },
  row: {
    marginBottom: 8,
    width: '48%',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#fff',
    fontFamily: 'Inter',
    fontWeight: '800',
  },
  optionalText: {
    fontSize: 15,
    fontWeight: '300',
    color: '#ccc',
    fontFamily: 'Inter',
  },
  dropdown: {
    height: 42,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  dropdownTiming: {
    height: 30,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    width: 165,
  },
  placeholderText: {
    fontSize: 10,
    color: '#000',
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  placeholderTextTimining:{
    fontSize: 10,
    color: '#000',
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  selectedText: {
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: '700',
    textAlign: 'center',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  iconStyle: {
    // width: 24,
    // height: 24,
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 9,
    // justifyContent: 'space-between',
  },
  timeDropdown: {
    height: 30,
    width: 53,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    paddingRight: 5,
  },
  halfColumn: {
    width: '48%',
  },
  textInputLiquid: {
    height: 30,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 12,
    width: 93,
  },
  textInput: {
    height: 30,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 12,
    width: 164,
  },
  textInput1: {
    height: 30,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 12,
    textAlign: 'center',
    width: 62,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  templateButton: {
    backgroundColor: 'white',
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  templateButtonText: {
    color: '#000',
    fontSize: 8,
    fontWeight: '900',
  },
  addButton: {
    backgroundColor: '#00E5FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  addButtonText: {
    color: '#000',
    fontSize: 8,
    fontWeight: '900',
  },
  categoryRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleStyle: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#000',
  },
  textInputPlaceholder: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#000',
  },
  containerStyle: {
    width: 100,
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
    // paddingLeft:3,
    // paddingRight:3
  },

  bottomButtonRow: {
    position: 'absolute',
    bottom: 21,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
   alignSelf:'center',
  },
  bottomButton: {
    position: 'absolute',
    bottom: 21,
    width: '100%',
    alignSelf: 'center',
  },
});

export default SupplmentFormComponent;
