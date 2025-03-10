import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import moment from 'moment';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = 30; // Base width for date items
const SELECTED_ITEM_WIDTH = 121; // Width of selected date item
const ITEM_MARGIN = 10; // Total horizontal margin (5 on each side)

const HorizontalDatePicker = ({ onDateSelect }) => {
  // Generate dates centered around today
  const generateDatesAroundToday = () => {
    const today = moment();
    let dates = [];
    
    // Add dates before today (past 7 days)
    for (let i = 7; i > 0; i--) {
      dates.push(moment(today).subtract(i, 'days').format('YYYY-MM-DD'));
    }
    
    // Add today
    dates.push(today.format('YYYY-MM-DD'));
    
    // Add dates after today (next 14 days)
    for (let i = 1; i <= 14; i++) {
      dates.push(moment(today).add(i, 'days').format('YYYY-MM-DD'));
    }
    
    return dates;
  };

  const [dates, setDates] = useState(generateDatesAroundToday());
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const flatListRef = useRef(null);
  const initialScrollDone = useRef(false);

  // More precise centering calculation
  const centerSelectedDate = (dateString) => {
    if (!flatListRef.current) return;
    
    const index = dates.indexOf(dateString);
    if (index === -1) return;
    
    // Calculate the middle of the screen
    const screenCenter = SCREEN_WIDTH / 2;
    
    // For dates before the selected date, calculate their total width
    let widthBeforeSelected = 0;
    for (let i = 0; i < index; i++) {
      widthBeforeSelected += (ITEM_WIDTH + ITEM_MARGIN);
    }
    
    // Calculate the position that would center the selected item
    const offset = widthBeforeSelected - screenCenter + (SELECTED_ITEM_WIDTH / 2);
    
    // Apply the scroll with a safe offset (not less than 0)
    flatListRef.current.scrollToOffset({
      offset: Math.max(0, offset),
      animated: true,
    });
  };

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    centerSelectedDate(date);
    
    // Call parent callback if provided
    if (onDateSelect) {
      onDateSelect(date);
    }

    // Add more dates if we're approaching the end
    const lastVisibleIndex = dates.length - 5;
    if (dates.indexOf(date) >= lastVisibleIndex) {
      const lastDate = dates[dates.length - 1];
      const nextDates = Array.from({ length: 7 }, (_, i) => 
        moment(lastDate).add(i + 1, 'days').format('YYYY-MM-DD')
      );
      setDates(prevDates => [...prevDates, ...nextDates]);
    }
  };

  // Center today's date when component mounts
  useEffect(() => {
    const todayIndex = dates.indexOf(moment().format('YYYY-MM-DD'));
    
    // Use a longer timeout to ensure rendering is complete
    const timer = setTimeout(() => {
      if (!initialScrollDone.current) {
        centerSelectedDate(selectedDate);
        initialScrollDone.current = true;
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Pre-scroll to approximately center the view when FlatList renders
  const getItemLayout = (data, index) => {
    const itemSize = index === dates.indexOf(selectedDate) ? SELECTED_ITEM_WIDTH : ITEM_WIDTH;
    
    // Calculate offset based on item sizes
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += (i === dates.indexOf(selectedDate) ? SELECTED_ITEM_WIDTH : ITEM_WIDTH) + ITEM_MARGIN;
    }
    
    return { length: itemSize + ITEM_MARGIN, offset, index };
  };

  const renderDateItem = ({ item }) => {
    const isSelected = selectedDate === item;
    const dateNum = moment(item).format('D');
    const isDoubleDigit = dateNum.length > 1;
    
    return (
      <TouchableOpacity
        onPress={() => handleDateSelection(item)}
        style={[
          styles.dateContainer,
          isSelected && styles.selectedDate,
        ]}>
        <Text 
          style={[
            styles.dateText, 
            isSelected && styles.selectedDateText,
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
        initialNumToRender={dates.length}
        getItemLayout={getItemLayout}
        initialScrollIndex={dates.indexOf(selectedDate) - 3} // Start a bit before today
        maxToRenderPerBatch={dates.length}
        windowSize={21}
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
    width: SELECTED_ITEM_WIDTH, // Wider width for selected date
  },
  dateText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  doubleDigitDate: {
    fontSize: 16,
  },
  selectedDateText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HorizontalDatePicker;