import { StyleSheet, View } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import HeaderComponent from '../components/HeaderComponent';
import WorkoutCard from '../components/WorkoutCard';
import Recovery from '../assets/images/recovery.svg';
import moment from 'moment';
import HorizontalDatePicker from '../components/HorizontalDatePicker';
import { Button } from '@rneui/themed';
import RecoveryForm from '../components/RecoveryForm';
import WorkoutLayout from '../components/WorkoutLayout';
import {
  useUserCardioContext,
  useUserRecoveryContext,
  useUserWorkoutContext,
} from '../context/UserContexts';
import {
  calculateTotalWorkoutWeight,
  calculateTotalRecoveryTime,
  getStartAndEndDate,
  calculateTotalCardioTime,
} from '../utils/calculate';
import CardioLayout from '../components/CardioLayout';
import RecoveryLayout from '../components/RecoveryLayout';
import {
  useFocusEffect,
  createStaticNavigation,
} from '@react-navigation/native';

const RecoveryScreen = () => {
  const [showForm, setshowForm] = useState(false);
  const [selectedRecovery, setSelectedRecovery] = useState(null);
  const { recoveryData, setRefresh } = useUserRecoveryContext();
  const [filteredWorkoutData, setFilteredWorkoutData] = useState([]);
  const recoveryFormRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );

  const getDates = () => {
    let dates = [];
    for (let i = -3; i <= 3; i++) {
      dates.push(moment().add(i, 'days').format('YYYY-MM-DD'));
    }
    return dates;
  };
  useFocusEffect(
    React.useCallback(() => {
      
      // Do something when the screen is focused
      return () => {
        setshowForm(false)
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  )
  useEffect(() => {
    console.log("🔥 Recovery data on load:", recoveryData);
    const today = moment().format('YYYY-MM-DD');
    onDateSelect(today);
  }, [recoveryData]);

  const onDateSelect = (selectedDate) => {
    console.log("📅 Selected Date:", selectedDate);
    setSelectedDate(selectedDate);
    const filteredRecoveryData = recoveryData.filter((item) => {
      if (item.createdAt) {
        const itemDate = moment.unix(item.createdAt.seconds).format("YYYY-MM-DD");
        return itemDate === selectedDate;
      }
      return false;
    });

    console.log("📊 Filtered Recovery Data:", filteredRecoveryData);
    setFilteredWorkoutData(filteredRecoveryData);
  };

  const filterDataByRange = (data, range) => {
    const { startDate, endDate } = getStartAndEndDate(range);
    return data.filter((item) => {
      if (item.createdAt) {
        const itemDate = new Date(item.createdAt.seconds * 1000);
        return itemDate >= startDate && itemDate <= endDate;
      }
      return false;
    });
  };

  const recoveryTimeToday = calculateTotalRecoveryTime(
    filterDataByRange(recoveryData, 'Today')
  );
  const recoveryTimeWeek = calculateTotalRecoveryTime(
    filterDataByRange(recoveryData, 'Week')
  );
  const recoveryTimeMonth = calculateTotalRecoveryTime(
    filterDataByRange(recoveryData, 'Month')
  );

  const handleFormSave = () => {
    setshowForm(false);  // Hide the form
    setSelectedRecovery(null); // Reset selected recovery
    setRefresh(prev => !prev); // Toggle refresh to trigger data reload
  };

  // Handler for when a recovery item is clicked
  const handleSelectRecovery = (recoveryItem) => {
    console.log("Selected recovery item:", recoveryItem);
    setSelectedRecovery(recoveryItem);
    setshowForm(true);
  };

  return (
    <View style={styles.container}>
      <HeaderComponent />
      {showForm ? (
        <>
          <RecoveryForm
            onSave={handleFormSave}
            onCancel={() => {
              setshowForm(false);
              setSelectedRecovery(null);
            }}
            recoveryData={selectedRecovery}
          />
        </>
      ) : (
        <>
          <WorkoutCard
            image={<Recovery width={50} height={50} />}
            name="Recovery"
            todayValue={recoveryTimeToday}
            weekValue={recoveryTimeWeek}
            monthValue={recoveryTimeMonth}
            unit={'min'}
          />
          <HorizontalDatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            minDate={moment().subtract(30, 'days').format('YYYY-MM-DD')}
            maxDate={moment().add(30, 'days').format('YYYY-MM-DD')}
            onCalendarOpen={() => console.log('Calendar opened')}
            onCalendarClose={() => console.log('Calendar closed')}
            onDateSelect={onDateSelect}
          />
          <WorkoutLayout
           title="Recovery"
           type="recovery"
           selectedDate={selectedDate}
           onSelectItem={handleSelectRecovery} // Add the handler for item selection
          
          />
          {/* <RecoveryLayout
            title="Recovery"
            type="recovery"
            selectedDate={selectedDate}
            onSelectItem={handleSelectRecovery} // Add the handler for item selection
          /> */}
           <View style={styles.bottomButton}>
            <Button
              onPress={() => setshowForm(true)}
              title="New Recovery"
              titleStyle={styles.buttonTextStyle}
              containerStyle={[styles.buttonConatiner]}
              buttonStyle={[styles.buttonStyle]}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default RecoveryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AFAFAF',
  },
  flatListContainer: {
    alignItems: 'center',
  },
  dateItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedDate: {
    backgroundColor: 'black',
  },
  dateText: {
    fontSize: 16,
    color: 'black',
  },
  selectedDateText: {
    color: 'white',
    fontWeight: 'bold',
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
  buttonConatiner: {
    alignSelf: 'center',
    marginRight: 15,
    marginTop: 9,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 21,
    width: '100%',
    alignSelf: 'center',
  },
});