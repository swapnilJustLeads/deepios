import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';
import DashboardCard from '../../components/DashboardCard';
import Calendar from '../../components/Calender';

const RecoveryScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Dummy recovery data (Replace with API data)
  const recoveryData = { Today: 15, Week: 60, Month: 200 };

  return (
    <View style={styles.container}>
      <Text h2 style={styles.header}>RECOVERY</Text>
      <ScrollView>
        <DashboardCard icon='Recovery Icon' title='RECOVERY' values={recoveryData} unit='min' />
        <Calendar setDate={setSelectedDate} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4C4C4',
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default RecoveryScreen;
