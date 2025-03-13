import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
} from 'react-native';

const CalendarUI = ({ onSelectDate, initialDate, multiSelect = true }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  // Change from single date to array of dates for multi-select
  const [selectedDates, setSelectedDates] = useState(initialDate ? [initialDate] : [new Date(2025, 2, 13)]);
  
  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Days of the week
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust to make Monday index 0
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // Check if a date is included in the selectedDates array
  const isSelectedDate = (day) => {
    return selectedDates.some(date => 
      date.getDate() === day &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  };
  
  // Format month name
  const formatMonth = () => {
    return `${currentDate.toLocaleString('default', { month: 'long' })}, ${currentYear}`;
  };

  // Handle day press - toggle date selection for multi-select
  const handleDayPress = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    
    // Check if date is already selected
    const isAlreadySelected = selectedDates.some(date => 
      date.getDate() === day &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
    
    let newSelectedDates;
    if (isAlreadySelected) {
      // Remove date if already selected
      newSelectedDates = selectedDates.filter(date => 
        !(date.getDate() === day &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear)
      );
    } else {
      // Add date if not already selected
      if (multiSelect) {
        // Add to existing selections if multiSelect is true
        newSelectedDates = [...selectedDates, newDate];
      } else {
        // Replace selection if multiSelect is false
        newSelectedDates = [newDate];
      }
    }
    
    setSelectedDates(newSelectedDates);
    
    // Notify parent about date selection
    if (onSelectDate) {
      if (multiSelect) {
        onSelectDate(newSelectedDates);
      } else {
        onSelectDate(newDate);
      }
    }
  };
  
  // Generate calendar grid
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell}>
          <Text></Text>
        </View>
      );
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = isSelectedDate(day);
      
      days.push(
        <TouchableOpacity 
          key={`day-${day}`} 
          style={styles.dayCell}
          onPress={() => handleDayPress(day)}
        >
          <View style={[
            styles.dayButton,
            isSelected && styles.selectedDay
          ]}>
            <Text style={[
              styles.dayText,
              isSelected && styles.selectedDayText
            ]}>
              {day}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    
    return days;
  };
  
  return (
    <View style={styles.calendarContainer}>
      {/* Month Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={prevMonth}>
          <Text style={styles.navButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{formatMonth()}</Text>
        <TouchableOpacity onPress={nextMonth}>
          <Text style={styles.navButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      
      {/* Selected Dates Count */}
      {multiSelect && selectedDates.length > 0 && (
        <View style={styles.selectedCountContainer}>
          <Text style={styles.selectedCountText}>
            {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected
          </Text>
        </View>
      )}
      
      {/* Weekday Headers */}
      <View style={styles.weekdayRow}>
        {weekdays.map(day => (
          <View key={day} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>
      
      {/* Calendar Days Grid */}
      <View style={styles.calendarGrid}>
        {renderCalendarDays()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 5,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  navButtonText: {
    fontSize: 20,
    color: '#000',
    paddingHorizontal: 10,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedCountContainer: {
    marginBottom: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: '#e6f7ff',
    borderRadius: 10,
  },
  selectedCountText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
  weekdayRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 5,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 2,
  },
  weekdayText: {
    fontSize: 14,
    // color: '#4a89f3',
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  dayCell: {
    width: '14.28%',
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  dayButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
  },
  selectedDay: {
    backgroundColor: '#000',
  },
  selectedDayText: {
    color: '#fff',
  }
});

export default CalendarUI;