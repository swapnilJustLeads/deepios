import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Text} from '@rneui/themed';
import DashboardCard from '../../components/DashboardCard';

const DashboardScreen = () => {
  // Dummy data (Replace with API data)
  const workoutData = {Today: 3605, Week: 15000, Month: 45000};
  const cardioData = {Today: 30, Week: 120, Month: 400};
  const recoveryData = {Today: 15, Week: 60, Month: 200};

  return (
    <View style={styles.container}>
      <Text h2 style={styles.header}>
        DEEPA
      </Text>

      <ScrollView style={styles.content}>
        {/* Dashboard Metrics */}
        <DashboardCard
          icon="Workout Icon"
          title="WORKOUT"
          values={workoutData}
          unit="kg"
        />
        <DashboardCard
          icon="Cardio Icon"
          title="CARDIO"
          values={cardioData}
          unit="min"
        />
        <DashboardCard
          icon="Recovery Icon"
          title="RECOVERY"
          values={recoveryData}
          unit="min"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
          activeOpacity={0.8}>
          <Text style={styles.text}>SUPPLEMENT</Text>
        </TouchableOpacity>
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
  content: {
    width: '100%',
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
  },
});

export default DashboardScreen;
