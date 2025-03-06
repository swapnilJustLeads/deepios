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

const WorkoutScreen = () => {
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
      {showForm ?  <WorkoutForm  addButton={()=> setshowForm(false) } /> : 
      <>
       <WorkoutCard
        image={<Bardumble width={42} height={42}  />}
        name="Workout"
      />
      <HorizontalDatePicker />
      <DefaultButton
       onPress={()=> setshowForm(true)}
       title="NEW WORKOUT"
       alignSelf="center"
       bottom={24}
       position="absolute"
      />
      <WorkoutListComponent />
      </>
      }
     
     
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
});
