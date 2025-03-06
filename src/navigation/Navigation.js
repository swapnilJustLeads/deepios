import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/auth/LoginScreen';

// SVG Imports (Ensure correct paths)
import DashboardIcon from '../assets/images/DashboardIcon.svg';
import Bardumble from '../assets/images/bardumble.svg';
import Cardio from '../assets/images/cardio.svg';
import Recovery from '../assets/images/recovery.svg';
import WorkoutScreen from '../screens/WorkoutScreen';
import SupplementScreen from '../screens/SupplementScreen';
import RecoveryScreen from '../screens/RecoveryScreen';
import CardioScreen from '../screens/CardioScreen';
import { Text, View } from 'react-native';

// Stack & Tab Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TabIcon = ({ icon: IconComponent, label, focused }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <IconComponent width={focused ? 28 : 24} height={focused ? 28 : 24} />
      <Text style={{ fontSize: 12, color: focused ? 'black' : 'gray', marginTop: 4 }}>
        {label}
      </Text>
    </View>
  );
};
// ✅ Bottom Tab Navigator (Tabs are only shown after login)
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide top header
        tabBarShowLabel: false, // Hide labels
        tabBarStyle: {
          backgroundColor: 'white',
          height: 60,
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarIcon: ({ focused }) => {
          let IconComponent;
          let size = focused ? 28 : 24;
          // CardioScreen
          if (route.name === 'Home') {
            IconComponent = <DashboardIcon width={size} height={size} />;
          } else if (route.name === 'Profile') {
            IconComponent = <Cardio width={size} height={size} />;
          } else if (route.name === 'Recovery') {
            IconComponent = <Recovery width={size} height={size} />;
          }
           else if (route.name === 'Workout') {
            IconComponent = <Bardumble width={size} height={size} />;
          } 
          else if (route.name === 'Cardio') {
            IconComponent = <Cardio width={size} height={size} />;
          } 
          else if (route.name === 'Supplement') {
            IconComponent = <Recovery width={size} height={size} />;
          }

          return IconComponent;
        },
      })}
    >
      <Tab.Screen name="Workout" component={WorkoutScreen} options={{
          tabBarIcon: ({ focused }) => <TabIcon icon={Bardumble} label="Workout" focused={focused} />,
        }} />
      <Tab.Screen name="Recovery" component={RecoveryScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen name="Cardio" component={CardioScreen} />
      <Tab.Screen name="Supplement" component={SupplementScreen} />
    </Tab.Navigator>
  );
};

// ✅ Main Stack Navigator (LoginScreen is separate)
export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false }}>
        {/* LoginScreen is independent, no bottom tabs */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />

        {/* Main App Navigation (with bottom tabs) */}
        <Stack.Screen name="Details" component={BottomTabNavigator} />
        <Stack.Screen name="Main" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
