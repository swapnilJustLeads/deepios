import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import HeaderComponent from '../components/HeaderComponent';
import WorkoutCard from '../components/WorkoutCard';
import Cardio from '../assets/images/cardio.svg';
import moment from 'moment';
import HorizontalDatePicker from '../components/HorizontalDatePicker';
import DefaultButton from '../components/DefaultButton';
import WorkoutListComponent from '../components/WorkoutListComponent';
import WorkoutForm from '../components/WorkoutForm';
import RecoveryCard from '../components/RecoveryCard';
import {Button} from '@rneui/themed';
import RecoveryForm from '../components/RecoveryForm';
import CardioForm from '../components/CardioForm';
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
import WorkoutLayout from '../components/WorkoutLayout';

const CardioScreen = () => {
  const [showForm, setshowForm] = useState(false);
  const { cardioData ,setRefresh} = useUserCardioContext();
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
  const closeSave = () => {
    setshowForm(false);
  } 
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
  const cardioTimeToday = calculateTotalCardioTime(
    filterDataByRange(cardioData, 'Today'),
    'time'
  );
  const cardioTimeWeek = calculateTotalCardioTime(
    filterDataByRange(cardioData, 'Week'),
    'time'
  );
  const cardioTimeMonth = calculateTotalCardioTime(
    filterDataByRange(cardioData, 'Month'),
    'time'
  );
  const handleFormSave = () => {
    setshowForm(false);  // Hide the form
    setRefresh(prev => !prev); // Toggle refresh to trigger data reload
  };
  return (
    <View style={styles.container}>
      <HeaderComponent />
      {showForm ? (
        <CardioForm   onSave={handleFormSave} 
        onCancel={() => setshowForm(false)}  />
      ) : (
        <>
          <WorkoutCard
            image={<Cardio width={50} height={50} />}
            name="Cardio"
           todayValue={cardioTimeToday}
           weekValue={cardioTimeWeek}
           monthValue={cardioTimeMonth}
           unit={'min'}
          />
          <HorizontalDatePicker />
          <WorkoutLayout title="Cardio" type="cardio" selectedDate={selectedDate} />
          <View style={styles.bottomButton}>
            

            <Button
              onPress={() => setshowForm(true)}
              buttonStyle={styles.buttonStyle}
              title="New TRAINING"
              titleStyle={styles.buttonTextStyle}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default CardioScreen;

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
    width: 100,
    backgroundColor: '#00E5FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextStyle: {
    fontFamily: 'Inter',
    fontSize: 8,
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
});
