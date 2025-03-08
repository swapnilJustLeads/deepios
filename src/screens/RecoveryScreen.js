import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import HeaderComponent from '../components/HeaderComponent';
import WorkoutCard from '../components/WorkoutCard';
import Recovery from '../assets/images/recovery.svg';
import moment from 'moment';
import HorizontalDatePicker from '../components/HorizontalDatePicker';
import {Button} from '@rneui/themed';
import RecoveryForm from '../components/RecoveryForm';
import WorkoutLayout from '../components/WorkoutLayout';

const RecoveryScreen = () => {
  const [showForm, setshowForm] = useState(false);
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
  return (
    <View style={styles.container}>
      <HeaderComponent />
      {showForm ? (
        <>
          <RecoveryForm />
          <View style={styles.bottomButton}>
            <Button
              onPress={() => setshowForm(false)}
              buttonStyle={styles.buttonStyle}
              title="Save"
              titleStyle={styles.buttonTextStyle}
            />
          </View>
        </>
      
      ) : (
        <>
          <WorkoutCard
            image={<Recovery width={50} height={50} />}
            name="Recovery"
          />
          <HorizontalDatePicker />
          <WorkoutLayout title="recovery" />

          <View style={styles.bottomButton}>
            <Button
              onPress={() => setshowForm(true)}
              buttonStyle={styles.buttonStyle}
              title="New Intake"
              titleStyle={styles.buttonTextStyle}
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
