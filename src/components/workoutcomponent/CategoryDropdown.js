import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

const CategoryDropdown = ({style, data = [{label: 'Back', value: 'back'}]}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Category</Text>
      <Dropdown
        placeholderStyle={styles.placeholderText}
        selectedTextStyle={styles.selectedText}
        style={styles.dropdown}
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        value={data[0].value}
        renderItem={item => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.label}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 165.5,
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
    paddingHorizontal: 10,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  itemText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 15,
  },
  placeholderText: {
    color: 'red',
  },
  selectedTextStyle: {
    color: 'red',
  },
});

export default CategoryDropdown;
