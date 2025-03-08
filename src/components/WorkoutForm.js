import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Button, Text} from '@rneui/themed';
import {Dropdown} from 'react-native-element-dropdown';
import Down from '../assets/images/down.svg';
import Summary from './Summary';

const WorkoutForm = props => {
  // State for form fields
  const [category, setCategory] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [sets, setSets] = useState(null);
  const [hours, setHours] = useState('07');
  const [minutes, setMinutes] = useState('19');
  const [reps, setReps] = useState(['3', '5', '10', '11', '7']);
  const [weights, setWeights] = useState(['5', '5', '4.5', '4', '4.5']);

  // Sample data for dropdowns
  const categoryData = [
    {label: 'Select Category', value: ''},
    {label: 'Back', value: 'back'},
    {label: 'Chest', value: 'chest'},
    {label: 'Legs', value: 'legs'},
    {label: 'Arms', value: 'arms'},
    {label: 'Shoulders', value: 'shoulders'},
    {label: 'Core', value: 'core'},
  ];

  const exerciseData = [
    {label: 'Select Exercise', value: ''},
    {label: 'Barbell Deadlift', value: 'barbell_deadlift'},
    {label: 'Bench Press', value: 'bench_press'},
    {label: 'Squats', value: 'squats'},
    {label: 'Pull-ups', value: 'pull_ups'},
  ];

  const setsData = Array.from({length: 10}, (_, i) => {
    const val = (i + 1).toString();
    return {label: val, value: val};
  });

  const hoursData = Array.from({length: 24}, (_, i) => {
    const val = i.toString().padStart(2, '0');
    return {label: val, value: val};
  });

  const minutesData = Array.from({length: 60}, (_, i) => {
    const val = i.toString().padStart(2, '0');
    return {label: val, value: val};
  });

  // Data for reps and weights dropdowns
  const repsData = Array.from({length: 20}, (_, i) => {
    const val = (i + 1).toString();
    return {label: val, value: val};
  });

  const weightsData = Array.from({length: 40}, (_, i) => {
    const val = (i * 0.5 + 0.5).toFixed(1);
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

  // Update reps and weights based on sets
  const updateFormArrays = newSets => {
    const setsNumber = parseInt(newSets, 10) || 0;
    // Adjust reps array
    const newReps = [...reps];
    while (newReps.length < setsNumber) {
      newReps.push('5');
    }
    while (newReps.length > setsNumber) {
      newReps.pop();
    }
    setReps(newReps);

    // Adjust weights array
    const newWeights = [...weights];
    while (newWeights.length < setsNumber) {
      newWeights.push('5');
    }
    while (newWeights.length > setsNumber) {
      newWeights.pop();
    }
    setWeights(newWeights);
  };

  const updateRep = (index, value) => {
    const newReps = [...reps];
    newReps[index] = value;
    setReps(newReps);
  };

  const updateWeight = (index, value) => {
    const newWeights = [...weights];
    newWeights[index] = value;
    setWeights(newWeights);
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
            data={categoryData}
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
            data={exerciseData}
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

      {/* Second Row: Sets and Time */}
      <View style={styles.middleRow}>
        <View style={styles.setsColumn}>
          <Text style={styles.label}>Sets</Text>
          <Dropdown
            style={styles.setsDropdown}
            placeholderStyle={styles.selectedText}
            selectedTextStyle={styles.selectedText}
            data={setsData}
            labelField="label"
            valueField="value"
            placeholder="Sets"
            value={sets}
            onChange={item => {
              setSets(item.value);
              updateFormArrays(item.value);
            }}
            renderItem={renderDropdownItem}
            renderRightIcon={() => <Down height={10} width={10} />}
          />
        </View>

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
      </View>

      {/* Reps Row */}
      <View style={styles.repWeightSection}>
        <Text style={styles.label}>Reps</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.scrollableContainer}>
            {reps.map((rep, index) => (
              <Dropdown
                key={`rep-${index}`}
                style={styles.repWeightDropdown}
                placeholderStyle={styles.selectedText}
                selectedTextStyle={styles.selectedText}
                data={repsData}
                labelField="label"
                valueField="value"
                value={rep}
                onChange={item => updateRep(index, item.value)}
                renderItem={renderDropdownItem}
                renderRightIcon={() => <Down height={10} width={10} />}
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
              <Dropdown
                key={`weight-${index}`}
                style={styles.repWeightDropdown}
                placeholderStyle={styles.selectedText}
                selectedTextStyle={styles.selectedText}
                data={weightsData}
                labelField="label"
                valueField="value"
                value={weight}
                onChange={item => updateWeight(index, item.value)}
                renderItem={renderDropdownItem}
                renderRightIcon={() => <Down height={10} width={10} />}
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
          onPress={props.addButton}
          buttonStyle={styles.buttonStyle}
          title="ADD"
          titleStyle={styles.buttonTextStyle}
        />
      </View>
      <Summary />
      <View style={styles.bottomButton}>
        <Button
          onPress={() => {
            if (props.onSave) {
              props.onSave();
            } else {
              console.log('Save pressed');
            }
          }}
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