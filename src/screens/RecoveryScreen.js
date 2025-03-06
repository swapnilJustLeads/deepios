import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import HeaderComponent from '../components/HeaderComponent';
import WorkoutCard from '../components/WorkoutCard';
import Recovery from '../assets/images/recovery.svg';
import moment from 'moment';
import HorizontalDatePicker from '../components/HorizontalDatePicker';
import DefaultButton from '../components/DefaultButton';
import WorkoutListComponent from '../components/WorkoutListComponent';
import WorkoutForm from '../components/WorkoutForm';
import RecoveryCard from '../components/RecoveryCard';

const RecoveryScreen = () => {
  const [showForm, setshowForm] = useState(false)
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
      {showForm ?  <WorkoutForm /> : 
      <>
       <RecoveryCard
        image={<Recovery width={50} height={50} />}
        name="Recovery"
      />
      {/* <HorizontalDatePicker /> */}
      {/* <DefaultButton
      onPress={()=> setshowForm(true)}
        title="New Workout"
        alignSelf="center"
        bottom={0}
        position="absolute"
      /> */}
      {/* <WorkoutListComponent /> */}
      </>
      }
     
     
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
});
