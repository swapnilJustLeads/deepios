import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import HeaderComponent from '../components/HeaderComponent';
import WorkoutCard from '../components/WorkoutCard';
import Bardumble from '../assets/images/bardumble.svg';
import moment from 'moment';
import HorizontalDatePicker from '../components/HorizontalDatePicker';
import DefaultButton from '../components/DefaultButton';
import WorkoutListComponent from '../components/WorkoutListComponent';
import WorkoutForm from '../components/WorkoutForm';
import WorkoutLayout from '../components/WorkoutLayout';
import {Button} from '@rneui/themed';

const WorkoutScreen = () => {
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
        <WorkoutForm
          onSave={() => setshowForm(false)}
          addButton={() => setshowForm(false)}
        />
      ) : (
        <>
          <WorkoutCard
            image={<Bardumble width={42} height={42} />}
            name="Workout"
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

          <WorkoutLayout title="Workout" />
          <View style={styles.bottomButton}></View>
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
