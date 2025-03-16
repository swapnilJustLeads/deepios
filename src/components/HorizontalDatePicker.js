import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Dimensions,
  Modal
} from 'react-native';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = 30; // Base width for date items
const SELECTED_ITEM_WIDTH = 121; // Width of selected date item
const ITEM_MARGIN = 10; // Total horizontal margin (5 on each side)

const HorizontalDatePicker = ({ 
  onDateSelect,
  initialDate,
  themeColor = 'black',
  accentColor = '#00E5FF',
  selectedItemWidth = 121,
  itemWidth = 30,
  showCalendarOnSelectedDatePress = true,
  confirmButtonText = 'Confirm',
  calendarHeaderText = ''
}) => {
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
  const [selectedDate, setSelectedDate] = useState(initialDate || moment().format('YYYY-MM-DD'));
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [currentMonth, setCurrentMonth] = useState(moment(selectedDate).format('MMMM YYYY'));
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

  // Function to open calendar when selected date is clicked
  const handleSelectedDateClick = () => {
    // Set current month to the month of selected date
    setCurrentMonth(moment(selectedDate).format('MMMM YYYY'));
    
    // Update marked dates to highlight the currently selected date
    const updatedMarkedDates = {
      [selectedDate]: {
        selected: true,
        selectedColor: themeColor,
      }
    };
    setMarkedDates(updatedMarkedDates);
    setCalendarVisible(true);
  };

  // Handle date selection from the calendar
  const handleCalendarDateSelect = (day) => {
    const dateString = day.dateString;
    
    // Close the calendar
    setCalendarVisible(false);
    
    // Update selected date and center it
    setSelectedDate(dateString);
    
    // Check if the date exists in our horizontal list
    const dateIndex = dates.indexOf(dateString);
    
    // If the date is not in our list, add it and surrounding dates
    if (dateIndex === -1) {
      const selectedMoment = moment(dateString);
      const newDates = [...dates];
      
      // Add 7 days before and 7 days after the selected date
      for (let i = -7; i <= 7; i++) {
        const newDate = selectedMoment.clone().add(i, 'days').format('YYYY-MM-DD');
        if (!newDates.includes(newDate)) {
          newDates.push(newDate);
        }
      }
      
      // Sort the dates
      newDates.sort();
      setDates(newDates);
      
      // Center after a brief delay to ensure rendering
      setTimeout(() => centerSelectedDate(dateString), 100);
    } else {
      centerSelectedDate(dateString);
    }
    
    // Call parent callback if provided
    if (onDateSelect) {
      onDateSelect(dateString);
    }
  };

  // Handle month navigation in calendar
  const handleMonthChange = (direction) => {
    const newMonth = moment(currentMonth, 'MMMM YYYY').add(direction, 'month');
    setCurrentMonth(newMonth.format('MMMM YYYY'));
  };

  // Render custom header for calendar
  const renderCalendarHeader = () => {
    return (
      <View style={styles.customCalendarHeader}>
        <TouchableOpacity onPress={() => handleMonthChange(-1)}>
          <Text style={styles.navigationArrow}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthYearText}>{currentMonth}</Text>
        <TouchableOpacity onPress={() => handleMonthChange(1)}>
          <Text style={styles.navigationArrow}>▶</Text>
        </TouchableOpacity>
      </View>
    );
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
        onPress={() => {
          if (isSelected && showCalendarOnSelectedDatePress) {
            // If clicking the already selected date and the feature is enabled, open the calendar
            handleSelectedDateClick();
          } else {
            // Otherwise just select the date
            handleDateSelection(item);
          }
        }}
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
      
      {/* Calendar Modal */}
      <Modal
        transparent={true}
        visible={calendarVisible}
        animationType="slide"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Calendar
              current={selectedDate}
              onDayPress={handleCalendarDateSelect}
              markedDates={markedDates}
              renderHeader={renderCalendarHeader}
              hideArrows={true}
              enableSwipeMonths={false}
              theme={{
                backgroundColor: 'white',
                calendarBackground: 'white',
                textSectionTitleColor: '#666',
                selectedDayBackgroundColor: '#4169E1',
                selectedDayTextColor: 'white',
                todayTextColor: accentColor,
                dayTextColor: '#333',
                textDisabledColor: '#d9e1e8',
                dotColor: themeColor,
                selectedDotColor: 'white',
                monthTextColor: 'black',
                textDayFontWeight: '400',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: 'bold',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 13,
                'stylesheet.calendar.header': {
                  header: {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginTop: 6,
                    alignItems: 'center'
                  },
                  week: {
                    marginTop: 7,
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                  },
                  dayHeader: {
                    marginTop: 2,
                    marginBottom: 7,
                    width: 32,
                    textAlign: 'center',
                    fontSize: 13,
                    fontWeight: 'bold',
                    color: '#666'
                  }
                },
                'stylesheet.day.basic': {
                  base: {
                    width: 32,
                    height: 32,
                    alignItems: 'center',
                    justifyContent: 'center'
                  },
                  today: {
                    borderWidth: 1,
                    borderColor: accentColor,
                    borderRadius: 16
                  },
                  todayText: {
                    color: accentColor,
                    fontWeight: 'bold'
                  },
                  selected: {
                    backgroundColor: '#4169E1',
                    borderRadius: 16
                  },
                  selectedText: {
                    color: 'white',
                    fontWeight: 'bold'
                  },
                  disabledText: {
                    color: '#d9e1e8'
                  }
                }
              }}
            />

          </View>
        </View>
      </Modal>
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
  
  // Calendar Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // Custom Calendar Header Styles
  customCalendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  navigationArrow: {
    fontSize: 18,
    color: '#666',
    padding: 5,
  },
});

export default HorizontalDatePicker;