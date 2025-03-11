import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import HeaderComponent from '../components/HeaderComponent';
import { useTranslation } from 'react-i18next';
import WorkoutCard from '../components/WorkoutCard';
import Bardumble from '../assets/images/bardumble.svg';
import moment from 'moment';
import HorizontalDatePicker from '../components/HorizontalDatePicker';
import DefaultButton from '../components/DefaultButton';
import WorkoutListComponent from '../components/WorkoutListComponent';
import WorkoutForm from '../components/WorkoutForm';
import WorkoutLayout from '../components/WorkoutLayout';
import {
  useUserWorkoutContext,
} from '../context/UserContexts';
import {
  calculateTotalWorkoutWeight,
  getStartAndEndDate,
} from '../utils/calculate';
import { useDetails } from '../context/DeatailsContext';
import {Button} from '@rneui/themed';

const WorkoutScreen = ({
  id,
  title = "",
  data = [],
  time = "",
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
  const { t } = useTranslation();
  const { refresh, setRefresh ,workoutData} = useUserWorkoutContext();
  const { parentIds, subCategories } = useDetails();
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
  const workoutWeightToday = calculateTotalWorkoutWeight(
    filterDataByRange(workoutData, 'Today')
  );
  const workoutWeightWeek = calculateTotalWorkoutWeight(
    filterDataByRange(workoutData, 'Week')
  );
  const workoutWeightMonth = calculateTotalWorkoutWeight(
    filterDataByRange(workoutData, 'Month')
  );
  return (
    <View style={styles.container}>
      <HeaderComponent />
      {showForm ? (
        <WorkoutForm
          onSave={() => setshowForm(false)}
          addButton={() => setshowForm(false)}
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
          <HorizontalDatePicker />
          <View style={{position: 'absolute', bottom: 9, alignSelf: 'center'}}>
            <Button
              containerStyle={[styles.buttonConatiner]}
              onPress={()=> setshowForm(true)}
              // onPress={saveJournal}
              buttonStyle={[styles.buttonStyle]}
              title="New Workout"
              titleStyle={styles.buttonTextStyle}
            />
          </View>

          <WorkoutLayout title="Workout" selectedDate={selectedDate} />
          {/* <View style={styles.bottomButton}></View> */}
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
    alignSelf: 'flex-end',
    marginRight: 15,
    marginTop: 9,
  },
});
