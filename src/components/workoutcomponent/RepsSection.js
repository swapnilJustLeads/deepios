import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const RepsSection = ({ style }) => {
  const [selectedReps, setSelectedReps] = useState([3, 5, 10, 11, 7]);

  const renderRepDropdown = (rep, index) => {
    return (
      <View key={index} style={styles.dropdownContainer}>
        <Dropdown
          style={styles.dropdown}
          data={selectedReps.map((r) => ({ label: r.toString(), value: r }))}
          labelField="label"
          valueField="value"
          value={rep}
          onChange={(item) => {
            const newReps = [...selectedReps];
            newReps[index] = item.value;
            setSelectedReps(newReps);
          }}
          placeholder="Select"
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle={styles.dropdownContainerStyle}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Reps</Text>
      <View style={styles.repsContainer}>
        {selectedReps.map((rep, index) => renderRepDropdown(rep, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 280,
    marginBottom: 10,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 5,
    fontFamily: 'Inter',
  },
  repsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    width: 46,
    height: 30,
  },
  dropdown: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
  },
  selectedTextStyle: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  dropdownContainerStyle: {
    backgroundColor: '#FFFFFF',
  },
});

export default RepsSection;

