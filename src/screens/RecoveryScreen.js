import { StyleSheet, View } from 'react-native';
import React, { useState, useRef ,useEffect} from 'react';
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

const RecoveryScreen = () => {
  const [showForm, setshowForm] = useState(false);
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
  useEffect(() => {
    console.log("🔥 cardioData on load:", recoveryData); // ✅ Check if cardio data exists
    const today = moment().format('YYYY-MM-DD');
    onDateSelect(today);
  }, [recoveryData]); // Runs whenever `cardioData` updates
  
  const onDateSelect = (selectedDate) => {
    console.log("📅 Selected Date:", selectedDate);
    setSelectedDate(selectedDate);
    const filteredCardioData = recoveryData.filter((item) => {
      if (item.createdAt) {
        const itemDate = moment.unix(item.createdAt.seconds).format("YYYY-MM-DD");
        return itemDate === selectedDate;
      }
      return false;
    });
  
    console.log("📊 Filtered Cardio Data:", filteredCardioData);
    setFilteredWorkoutData(filteredCardioData);
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
    setRefresh(prev => !prev); // Toggle refresh to trigger data reload
  };
  return (
    <View style={styles.container}>
      <HeaderComponent />
      {showForm ? (
        <>
          <RecoveryForm
            ref={recoveryFormRef}
            onSave={handleFormSave}
            onCancel={() => setshowForm(false)} />
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
          <View style={{ position: 'absolute', bottom: 9, alignSelf: 'center' }}>
            <Button
              onPress={() => setshowForm(true)}
              title="New Recovery"
              titleStyle={styles.buttonTextStyle}
              containerStyle={[styles.buttonConatiner]}
              buttonStyle={[styles.buttonStyle]}
            />
          </View>
          <WorkoutLayout title="Recovery" type="recovery" selectedDate={selectedDate} />


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
    alignSelf: 'flex-end',
    marginRight: 15,
    marginTop: 9,
  },
});
