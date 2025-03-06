import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
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

export default function DetailsScreen({navigation}) {
  const isDarkMode = useSelector(state => state.theme.darkMode);
  const {t} = useTranslation();

  const backgroundColor = isDarkMode ? '#AEAEAE' : '#B0B0B0';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';

  return (
    <View style={{flex: 1, backgroundColor}}>
      <HeaderComponent />
     
      <View style={{height:30}} />

      <WorkoutCard
        image={<Bardumble width={50} height={50} />}
        name="Workout"
      />
      <WorkoutCard image={<Cardio width={50} height={50} />} name="Cardio" />
      <WorkoutCard
        image={<Recovery width={50} height={50} />}
        name="Recovery"
      />

      {/* <View style={styles.listContainer} >
        <View>
        <Text>Workout</Text>
        <View>
          
        </View>

        </View>

      </View> */}
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
});
