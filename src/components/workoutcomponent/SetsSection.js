import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const SetsSection = ({ style }) => {
  const [sets, setSets] = useState(5);

  const data = Array.from({ length: 10 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }));

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Sets</Text>
      <Dropdown
        style={styles.dropdown}
        data={data}
        labelField="label"
        valueField="value"
        value={sets}
        onChange={item => setSets(item.value)}
        placeholder="Select"
        selectedTextStyle={styles.selectedTextStyle}
        containerStyle={styles.dropdownContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 51,
    padding: 5,
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 5,
    lineHeight: 14,
  },
  dropdown: {
    height: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  selectedTextStyle: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 15,
  },
  dropdownContainer: {
    borderRadius: 6,
  },
});

SetsSection.defaultProps = {
  style: {},
};

export default SetsSection;

