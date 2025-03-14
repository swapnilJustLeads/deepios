import {StyleSheet, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import HeaderComponent from '../components/HeaderComponent';
import {useTranslation} from 'react-i18next';
import WorkoutCard from '../components/WorkoutCard';
import Bardumble from '../assets/images/bardumble.svg';
import moment from 'moment';
import HorizontalDatePicker from '../components/HorizontalDatePicker';
import WorkoutForm from '../components/WorkoutForm';
import WorkoutLayout from '../components/WorkoutLayout';
import {useUserWorkoutContext} from '../context/UserContexts';
import {
  calculateTotalWorkoutWeight,
  getStartAndEndDate,
} from '../utils/calculate';
import {useDetails} from '../context/DeatailsContext';
import {Button} from '@rneui/themed';
import {addUser} from '../firebase/firebase_client';
import {useTheme} from '../hooks/useTheme';
import {useFocusEffect, createStaticNavigation} from '@react-navigation/native';

const WorkoutScreen = ({
  id,
  title = '',
  data = [],
  time = '',
  onBoxClick = () => {},
  onRowClick = () => {},
  handleRemoveItem = () => {},
  isFormView = false,
  isCopyBtn = false,
  trainingName,
  isDeleteItem = false,
  handleMoveItem,
}) => {
  const [showForm, setshowForm] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const {t} = useTranslation();
  const {isDarkMode} = useTheme();
  const {refresh, setRefresh, workoutData} = useUserWorkoutContext();
  const {parentIds, subCategories} = useDetails();
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      return () => {
        setshowForm(false);
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );
  const getDates = () => {
    let dates = [];
    for (let i = -3; i <= 3; i++) {
      dates.push(moment().add(i, 'days').format('YYYY-MM-DD'));
    }
    return dates;
  };

  useEffect(() => {
    // Filter workouts for today's date on initial load
    const today = moment().format('YYYY-MM-DD');
    onDateSelect(today);
  }, [workoutData]); // 🔥 Run this effect whenever `workoutData` changes

  const onDateSelect = selectedDate => {
    console.log('📅 Selected Date:', selectedDate);
    setSelectedDate(selectedDate); // ✅ Update selected date state properly
  };

  const filterDataByRange = (data, range) => {
    const {startDate, endDate} = getStartAndEndDate(range);
    return data.filter(item => {
      if (item.createdAt) {
        const itemDate = new Date(item.createdAt.seconds * 1000);
        return itemDate >= startDate && itemDate <= endDate;
      }
      return false;
    });
  };

  const workoutWeightToday = calculateTotalWorkoutWeight(
    filterDataByRange(workoutData, 'Today'),
  );
  const workoutWeightWeek = calculateTotalWorkoutWeight(
    filterDataByRange(workoutData, 'Week'),
  );
  const workoutWeightMonth = calculateTotalWorkoutWeight(
    filterDataByRange(workoutData, 'Month'),
  );

  // Handle form save (used for both new and edited workouts)
  const handleFormSave = () => {
    setshowForm(false);
    setSelectedWorkout(null);
    setRefresh(prev => !prev); // Toggle refresh to trigger data reload
  };

  // Handler for when a workout item is clicked
  const handleSelectWorkout = workoutItem => {
    console.log('Selected workout item:', workoutItem);
    setSelectedWorkout(workoutItem);
    setshowForm(true);
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? 'black' : '#AFAFAF'},
      ]}>
      <HeaderComponent />
      {showForm ? (
        <WorkoutForm
          onSave={handleFormSave}
          onCancel={() => {
            setshowForm(false);
            setSelectedWorkout(null);
          }}
          workoutData={selectedWorkout}
        />
      ) : (
        <>
          <WorkoutCard
            image={<Bardumble width={42} height={42} />}
            name="Workout"
            todayValue={workoutWeightToday}
            weekValue={workoutWeightWeek}
            monthValue={workoutWeightMonth}
            unit={'kg'}
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
            title="Workout"
            selectedDate={selectedDate}
            onSelectItem={handleSelectWorkout}
            type="workout"
          />
          <View style={styles.bottomButton}>
            <Button
              containerStyle={[styles.buttonConatiner]}
              onPress={() => setshowForm(true)}
              buttonStyle={[styles.buttonStyle]}
              title="New Workout"
              titleStyle={styles.buttonTextStyle}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default WorkoutScreen;

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
