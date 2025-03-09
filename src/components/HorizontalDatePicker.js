import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import moment from 'moment';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = 30; // Base width for date items
const SELECTED_ITEM_WIDTH = 121; // Width of selected date item
const ITEM_MARGIN = 10; // Total horizontal margin (5 on each side)
const PAST_DAYS = 30; // Number of past days to show

const HorizontalDatePicker = () => {
  const [dates, setDates] = useState(generateDates(moment(), PAST_DAYS, 14));
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const flatListRef = useRef(null);

  function generateDates(currentDate, pastDays, futureDays) {
    let dateArray = [];
    
    // Add past dates
    for (let i = pastDays; i > 0; i--) {
      dateArray.push(moment(currentDate).subtract(i, 'days').format('YYYY-MM-DD'));
    }
    
    // Add current date
    dateArray.push(moment(currentDate).format('YYYY-MM-DD'));
    
    // Add future dates
    for (let i = 1; i <= futureDays; i++) {
      dateArray.push(moment(currentDate).add(i, 'days').format('YYYY-MM-DD'));
    }
    
    return dateArray;
  }

  function centerSelectedDate(index) {
    if (flatListRef.current && index !== -1) {
      // Calculate the center position of the viewport
      const viewportCenter = SCREEN_WIDTH / 2;
      
      // Calculate the position where we want the selected item to be
      const targetPosition = viewportCenter - SELECTED_ITEM_WIDTH / 2;
      
      // Calculate the offset needed to position the selected item at the target position
      const offset = index * (ITEM_WIDTH + ITEM_MARGIN) - targetPosition + ITEM_MARGIN / 2;
      
      // Ensure we don't scroll to negative offsets
      const safeOffset = Math.max(0, offset);
      
      flatListRef.current.scrollToOffset({
        offset: safeOffset,
        animated: true,
      });
    }
  }

  function handleDateSelection(date) {
    setSelectedDate(date);
    
    // Find the index of the selected date
    const selectedIndex = dates.indexOf(date);
    centerSelectedDate(selectedIndex);

    // Check if approaching end of list, then add new future dates
    const lastVisibleIndex = dates.length - 5; // Add more dates when we're 5 items from the end
    if (selectedIndex >= lastVisibleIndex) {
      const nextWeekStart = moment(dates[dates.length - 1]).add(1, 'days');
      const newDates = [];
      for (let i = 0; i < 7; i++) {
        newDates.push(moment(nextWeekStart).add(i, 'days').format('YYYY-MM-DD'));
      }
      setDates((prevDates) => [...prevDates, ...newDates]);
    }
    
    // Check if approaching beginning of list, then add new past dates
    const firstVisibleIndex = 5; // Add more dates when we're 5 items from the beginning
    if (selectedIndex <= firstVisibleIndex) {
      const prevWeekStart = moment(dates[0]).subtract(7, 'days');
      const newDates = [];
      for (let i = 6; i >= 0; i--) {
        newDates.push(moment(prevWeekStart).add(i, 'days').format('YYYY-MM-DD'));
      }
      setDates((prevDates) => [...newDates, ...prevDates]);
      
      // Adjust the selected index after prepending items
      const newSelectedIndex = dates.indexOf(selectedDate) + 7;
      setTimeout(() => {
        centerSelectedDate(newSelectedIndex);
      }, 100);
    }
  }

  useEffect(() => {
    // Center the initially selected date on mount
    const initialIndex = dates.indexOf(selectedDate);
    
    // Use a slightly longer timeout to ensure the layout is complete
    setTimeout(() => {
      centerSelectedDate(initialIndex);
    }, 400);
  }, []);

  const renderDateItem = ({ item }) => {
    const isSelected = selectedDate === item;
    const dateNum = moment(item).format('D');
    const isDoubleDigit = dateNum.length > 1;
    const isPastDate = moment(item).isBefore(moment().startOf('day'));
    
    return (
      <TouchableOpacity
        onPress={() => handleDateSelection(item)}
        style={[
          styles.dateContainer,
          isSelected && styles.selectedDate,
          isPastDate && !isSelected && styles.pastDate
        ]}>
        <Text 
          style={[
            styles.dateText, 
            isSelected && styles.selectedDateText,
            isPastDate && !isSelected && styles.pastDateText,
            isDoubleDigit && !isSelected && styles.doubleDigitDate
          ]}>
          {isSelected ? moment(item).format('ddd, D MMM') : dateNum}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={dates}
        horizontal
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={PAST_DAYS + 15}
        maxToRenderPerBatch={PAST_DAYS + 15}
        windowSize={7}
        onScrollToIndexFailed={(info) => {
          // Handle scroll failure gracefully
          setTimeout(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToOffset({
                offset: info.averageItemLength * info.index,
                animated: false,
              });
            }
          }, 100);
        }}
        renderItem={renderDateItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    // backgroundColor: '#B3B3B3', 
  },
  dateContainer: {
    width: ITEM_WIDTH,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedDate: {
    backgroundColor: 'black',
    borderRadius: 20,
    paddingHorizontal: 10,
    width: 121, // Wider width for selected date
  },
  dateText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  pastDate: {
    // Optional - slight visual difference for past dates
  },
  pastDateText: {
    color: '#888', // Lighter color for past dates
  },
  doubleDigitDate: {
    // Slight adjustment for double digit dates
    fontSize: 16,
  },
  selectedDateText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HorizontalDatePicker;