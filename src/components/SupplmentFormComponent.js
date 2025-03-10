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
} from '@react-native-firebase/firestore';
import { COLLECTIONS } from '../firebase/collections';
import { FirestoreDB } from '../firebase/firebase_client';
import Summary from './Summary';



const SupplmentFormComponent = ({onSave}) => {
  // State for form fields
  const [category, setCategory] = useState(null);
  const [supplement, setSupplement] = useState(null);
  const [hours, setHours] = useState('13');
  const [minutes, setMinutes] = useState('06');
  const [liquid, setLiquid] = useState('');
  const [amount, setAmount] = useState('1-10');
  const [company, setCompany] = useState('');
  const [timing, setTiming] = useState(null);
  const { userDetails } = useUserDetailsContext();
    // Added state for tracking supplement items
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

  // Sample data for dropdowns
  const categoryData = [
    {label: 'Vitamins', value: 'vitamins'},
    {label: 'Minerals', value: 'minerals'},
    {label: 'Herbs', value: 'herbs'},
    {label: 'Protein', value: 'protein'},
  ];

  const supplementData = [
    {label: 'Vitamin C', value: 'vitamin_c'},
    {label: 'Vitamin D', value: 'vitamin_d'},
    {label: 'Zinc', value: 'zinc'},
    {label: 'Magnesium', value: 'magnesium'},
  ];

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
      timing: timing || ''
    };
    
    // Add to supplement items list
    setSupplementItems(prevItems => [...prevItems, newSupplementItem]);
    
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
  const handleSaveSupplement = async () => {
    try {
      // Create date with selected time
      const currentDate = new Date();
      const supplementTime = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        parseInt(hours, 10),
        parseInt(minutes, 10),
        0
      );
      
      // Format data for Firebase
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
        createdAt: supplementTime,
        parent: parentIds.Supplement,
        username: userDetails?.username,
        template: null
      };
      
      // Save to Firestore
      const dataCollection = collection(FirestoreDB, COLLECTIONS.DATA);
      const docRef = await addDoc(dataCollection, payload);
      console.log("Supplement data saved with ID: ", docRef.id);
      
      // Reset form
      setSupplementItems([]);
      setCategory(null);
      setSupplement(null);
      setLiquid('');
      setAmount('1-10');
      setCompany('');
      setTiming(null);
      
      // Callback
      if (onSave) {
        onSave(docRef.id);
      }
      
      console.log('Supplement data saved successfully');
    } catch (error) {
      console.error("Error saving supplement data:", error);
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
              backgroundColor:'#fff'
            }
           
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
              backgroundColor:'#fff'
            }
           
          ]}
          title="Save Templete"
          titleStyle={styles.buttonTextStyle}
        />
        <Button
          // containerStyle={{marginLeft: 21}}
           onPress={handleAddSupplement}
          buttonStyle={[
            styles.buttonStyle,
           
          ]}
          title="ADD"
          titleStyle={styles.buttonTextStyle}
        />
      </View>
        {/* Summary component */}
        <Summary 
        title="Supplement Summary" 
        supplement={supplementItems}
        // onDeleteSupplement={handleDeleteSupplement} 
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
              onPress={handleSaveSupplement}
              buttonStyle={[styles.buttonStyle]}
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
    borderRadius: 8,
    flex:1
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
    fontSize: 11,
    color: '#000',
    fontFamily: 'Inter',
    fontWeight: '700',
  },
  placeholderTextTimining:{
    fontSize: 11,
    color: '#000',
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  selectedText: {
    fontSize: 14,
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
   alignSelf:'center'
  },
  bottomButton: {
    position: 'absolute',
    bottom: 21,
    width: '100%',
    alignSelf: 'center',
  },
});

export default SupplmentFormComponent;
