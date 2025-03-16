import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from '@rneui/themed';
import Calendar from '../../components/Calender';

const SupplementScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>A</Text>
        <Text h2 style={styles.logo}>DEEPA</Text>
        <Text style={styles.headerText}>B</Text>
      </View>

      {/* Calendar Component */}
      <Calendar setDate={setSelectedDate} />

      {/* New Intake Button */}
      <Button
        title="NEW INTAKE"
        buttonStyle={styles.newIntakeButton}
        titleStyle={styles.newIntakeText}
        onPress={() => navigation.navigate('NewSupplement')}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  newIntakeButton: {
    backgroundColor: '#5ED4FF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,

  },
  newIntakeText: {
    fontWeight: 'bold',
    color: '#000',
  },
});

export default SupplementScreen;
