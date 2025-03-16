import React, {useState,useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Button} from '@rneui/themed';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Dashboardlogo from '../assets/images/dashboardlogo.svg';
import Rightlogo from '../assets/images/rightlogo.svg';
import LeftLogo from '../assets/images/LeftLogo.svg';
import WorkoutCard from '../components/WorkoutCard';
import Bardumble from '../assets/images/bardumble.svg';
import Cardio from '../assets/images/cardio.svg';
import Recovery from '../assets/images/recovery.svg';
import HeaderComponent from '../components/HeaderComponent';
import HorizontalDatePicker from '../components/HorizontalDatePicker';
import Journalinput from '../components/Journalinput';
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

export default function HomeScreen({navigation}) {
  const [showJournal, setShowJournal] = useState(false);
  const isDarkMode = useSelector(state => state.theme.darkMode);
  const { workoutData } = useUserWorkoutContext();
  const { cardioData } = useUserCardioContext();
  const { recoveryData } = useUserRecoveryContext();
  const {t} = useTranslation();
  const backgroundColor = isDarkMode ? '#AEAEAE' : '#B0B0B0';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';

  useEffect(() => {
    // ✅ Ensure HomeScreen does not auto-switch to Journal mode on mount
    setShowJournal(false);
  }, []);
  useEffect(() => {
    console.log('✅ HomeScreen Workout Data Updated:', workoutData);
  }, [workoutData]);


  const onPress = () => {
    setShowJournal(true);
  };
  const onPressSupplement = () => {
    navigation.navigate("Supplement")
  }

  const closeJournal = () => {
    setShowJournal(false)
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
  const workoutWeightToday = calculateTotalWorkoutWeight(
    filterDataByRange(workoutData, 'Today')
  );
  const workoutWeightWeek = calculateTotalWorkoutWeight(
    filterDataByRange(workoutData, 'Week')
  );
  const workoutWeightMonth = calculateTotalWorkoutWeight(
    filterDataByRange(workoutData, 'Month')
  );

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

  const recoveryTimeToday = calculateTotalRecoveryTime(
    filterDataByRange(recoveryData, 'Today')
  );
  const recoveryTimeWeek = calculateTotalRecoveryTime(
    filterDataByRange(recoveryData, 'Week')
  );
  const recoveryTimeMonth = calculateTotalRecoveryTime(
    filterDataByRange(recoveryData, 'Month')
  );
  return (
    <View style={{flex: 1, backgroundColor}}>
      <HeaderComponent />
      {showJournal ? (
        <>
          <HorizontalDatePicker />
          <Journalinput saveJournal={closeJournal} />
        </>
      ) : (
        <>
          <WorkoutCard
        image={<Bardumble width={50} height={50} />}
        name="Workout"
        todayValue={workoutWeightToday}
        weekValue={workoutWeightWeek}
        monthValue={workoutWeightMonth}
        unit={'kg'}
          />
          <WorkoutCard
           image={<Cardio width={50} height={50} />}
           name="Cardio"
           todayValue={cardioTimeToday}
           weekValue={cardioTimeWeek}
           monthValue={cardioTimeMonth}
           unit={'min'}
          />
          <WorkoutCard
         image={<Recovery width={50} height={50} />}
         name="Recovery"
         todayValue={recoveryTimeToday}
         weekValue={recoveryTimeWeek}
         monthValue={recoveryTimeMonth}
         unit={'min'}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginLeft: 21,
              marginRight: 21,
              marginTop: 18,
            }}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  width: 133,
                },
              ]}
              onPress={onPressSupplement}
              activeOpacity={0.8}>
              <Text style={styles.text}>SUPPLEMENT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  width: 60,
                },
              ]}
              onPress={onPress}
              activeOpacity={0.8}>
              <Text style={styles.text}>PR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  width: 133,
                },
              ]}
              onPress={onPress}
              activeOpacity={0.8}>
              <Text style={styles.text}>Journal</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 21,
    height: 90,
    alignSelf: 'center',
    borderWidth: 1.5,
  },
  button: {
    width: 133,
    height: 43,
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 25,
    color: '#000000',
    fontWeight: '400',
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 25,
    fontFamily: 'Stomic',
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
});
