import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import WorkoutCard from '../components/WorkoutCard';
import Bardumble from '../assets/images/bardumble.svg';
import Cardio from '../assets/images/cardio.svg';
import Recovery from '../assets/images/recovery.svg';
import HeaderComponent from '../components/HeaderComponent';
import Workoutwhite from '../assets/images/workout-white.svg';
import Recoverywhite from '../assets/images/recovery-white.svg';
import Cardiowhite from '../assets/images/Cardio-white.svg';
import HorizontalDatePicker from '../components/HorizontalDatePicker';
import Journalinput from '../components/Journalinput';
import {
  useUserCardioContext,
  useUserRecoveryContext,
  useUserWorkoutContext,
} from '../context/UserContexts';
import {useTheme} from '../hooks/useTheme';
import { calculateTotalCardioTime } from '../utils/calculate';

export default function HomeScreen({navigation}) {
  const [showJournal, setShowJournal] = useState(false);
  const {isDarkMode} = useTheme();
  const {workoutData} = useUserWorkoutContext();

  const {t} = useTranslation();

  useEffect(() => {
    console.log('✅ HomeScreen Workout Data Updated:', workoutData);
  }, [workoutData]);

  const onPress = () => {
    setShowJournal(true);
  };
  const closeJournal = () => {
    setshowJournal(false);
  };

  // const cardioTimeToday = calculateTotalCardioTime(
  //   filterDataByRange(cardioData, 'Today'),
  //   'time'
  // );
  // const cardioTimeWeek = calculateTotalCardioTime(
  //   filterDataByRange(cardioData, 'Week'),
  //   'time'
  // );
  // const cardioTimeMonth = calculateTotalCardioTime(
  //   filterDataByRange(cardioData, 'Month'),
  //   'time'
  // );

  // const recoveryTimeToday = calculateTotalRecoveryTime(
  //   filterDataByRange(recoveryData, 'Today')
  // );
  // const recoveryTimeWeek = calculateTotalRecoveryTime(
  //   filterDataByRange(recoveryData, 'Week')
  // );
  // const recoveryTimeMonth = calculateTotalRecoveryTime(
  //   filterDataByRange(recoveryData, 'Month')
  // );
  return (
    <View
      style={{flex: 1, backgroundColor: isDarkMode ? '#000000' : '#FFFFFF'}}>
      <HeaderComponent />
      {showJournal ? (
        <>
          <HorizontalDatePicker />
          <Journalinput saveJournal={closeJournal} />
        </>
      ) : (
        <>
          <WorkoutCard
            image={
              isDarkMode ? (
                <Workoutwhite width={50} height={50} />
              ) : (
                <Bardumble width={50} height={50} />
              )
            }
            name="Workout"
          />
          <WorkoutCard
            image={
              isDarkMode ? (
                <Cardiowhite width={50} height={50} />
              ) : (
                <Cardio width={50} height={50} />
              )
            }
            name="Cardio"
          />
          <WorkoutCard
            image={
              isDarkMode ? (
                <Recoverywhite width={50} height={50} />
              ) : (
                <Recovery width={50} height={50} />
              )
            }
            name="Recovery"
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
                  backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
                  borderColor: isDarkMode ? '#FFFFFF' : '#000000',
                },
              ]}
              onPress={onPress}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.text,
                  {
                    color: isDarkMode ? '#FFFFFF' : '#000000',
                  },
                ]}>
                SUPPLEMENT
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  width: 60,
                  backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
                  borderColor: isDarkMode ? '#FFFFFF' : '#000000',
                },
              ]}
              onPress={onPress}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.text,
                  {
                    color: isDarkMode ? '#FFFFFF' : '#000000',
                  },
                ]}>
                PR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  width: 133,
                  backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
                  borderColor: isDarkMode ? '#FFFFFF' : '#000000',
                },
              ]}
              onPress={onPress}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.text,
                  {
                    color: isDarkMode ? '#FFFFFF' : '#000000',
                  },
                ]}>
                Journal
              </Text>
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
