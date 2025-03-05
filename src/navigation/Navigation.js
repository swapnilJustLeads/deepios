import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import DashboardScreen from '../screens/dashboard/Dashboard';
import RecoveryScreen from '../screens/recovery/Recovery';
import SupplementScreen from '../screens/supplyment/Supplyments';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen}/>
        <Stack.Screen name="DashboardScreen" component={DashboardScreen}/>
        <Stack.Screen name="Recovery" component={RecoveryScreen}/>
        <Stack.Screen name="Supplyments" component={SupplementScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
