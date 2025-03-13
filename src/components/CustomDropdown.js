import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Down from '../assets/images/down.svg';

const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Select item', 
  containerStyle,
  placeholderStyle,
  selectedStyle,
  itemTextStyle,
  dropdownStyle,
  isBullet,
  showChevron = true,
  isScrollable = false, // New prop for scrollable content
  maxHeight = 250 // Default max height 
}) => {
  // Ensure options are in the correct format
  const formattedOptions = options.map(opt => 
    typeof opt === 'object' && opt.label && opt.value !== undefined 
      ? opt 
      : { label: String(opt), value: opt }
  );

  // Custom render for dropdown item with bullet
  const renderItem = (item) => {
    if (isBullet) {
      // With bullet (left-aligned with bullet)
      return (
        <View style={styles.item}>
          <View style={styles.bulletContainer}>
            <View style={styles.bullet} />
          </View>
          <Text style={[styles.itemText, itemTextStyle]}>{item.label}</Text>
        </View>
      );
    } else {
      // Without bullet (centered)
      return (
        <View style={styles.centeredItem}>
          <Text style={[styles.itemText, itemTextStyle]}>{item.label}</Text>
        </View>
      );
    }
  };

  // Conditional rendering for the right icon
  const renderRightIcon = () => {
    if (showChevron) {
      return <Down height={14} width={14} />;
    }
    return null;
  };

  return (
    <Dropdown
      style={[styles.dropdown, containerStyle]}
      placeholderStyle={[styles.placeholderText, placeholderStyle]}
      selectedTextStyle={[styles.selectedText, selectedStyle]}
      itemTextStyle={[styles.itemText, itemTextStyle]}
      data={formattedOptions}
      maxHeight={isScrollable ? 200 : maxHeight} // Shorter height for scrollable dropdowns
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={value}
      onChange={item => onChange(item.value)}
      renderItem={renderItem}
      renderRightIcon={renderRightIcon}
      dropdownPosition="auto"
      autoScroll={true}
      activeColor="#f0f0f0"
      containerStyle={[styles.dropdownContainer, dropdownStyle]}
      search={isScrollable} // Enable search for scrollable content if needed
      searchPlaceholder="Search..."
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    height: 30,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
    // textAlign: 'center',
  },
  selectedText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletContainer: {
    marginRight: 8,
    width: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#000',
  },
  itemText: {
    fontSize: 10,
    color: '#000',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  centeredItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomDropdown;