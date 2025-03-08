import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import LoginScreen from '../screens/auth/LoginScreen';

// SVG Imports (Ensure correct paths)
import DashboardIcon from '../assets/images/DashboardIcon.svg';
import LogoBlack from '../assets/images/logo-black.svg';
import Supplement from '../assets/images/suppliment.svg';
import SupplementBlue from '../assets/images/supplement-blue.svg';
import Bardumble from '../assets/images/bardumble.svg';
import BardumbleBlue from '../assets/images/workout-blue.svg';
import Cardio from '../assets/images/cardio.svg';
import CardioBlue from '../assets/images/cardio-blue.svg';
import Recovery from '../assets/images/recovery.svg';
import RecoveryBlue from '../assets/images/recovery-blue.svg';
import WorkoutScreen from '../screens/WorkoutScreen';
import SupplementScreen from '../screens/SupplementScreen';
import RecoveryScreen from '../screens/RecoveryScreen';
import CardioScreen from '../screens/CardioScreen';
import {Text, View} from 'react-native';
import ProfileScreen from '../screens/ProfileScreen';

// Stack & Tab Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({icon, iconFocused, label, focused}) => {
  const IconComponent = focused ? iconFocused : icon;
  const iconSize = label === 'Home' ? (focused ? 51 : 36) : 28; // Bigger size for Home icon

  return (
    <View style={{alignItems: 'center', width: 70}}>
      {' '}
      {/* Ensure enough space */}
      <IconComponent width={iconSize} height={iconSize} />
      {label !== 'Home' && (
        <Text
          style={{
            fontFamily: 'Stomic',
            fontSize: 16,
            lineHeight:24,
            fontWeight: '400',
            color: focused ? '#00E5FF' : '#000000',
            textTransform: 'uppercase',
            textAlign: 'center', // Prevents wrapping
        
          }}
          numberOfLines={1} // Force single line
        >
          {label}
        </Text>
      )}
    </View>
  );
};

// ✅ Bottom Tab Navigator (Tabs are only shown after login)
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Hide top header
        tabBarShowLabel: false, // Hide labels
        tabBarStyle: {
          backgroundColor: 'white',
          height: 80,
          elevation: 10,
          paddingTop: 15,
        },
      }}>
      <Tab.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              icon={Bardumble}
              iconFocused={BardumbleBlue}
              label="Workout"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Recovery"
        component={RecoveryScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              icon={Recovery}
              iconFocused={RecoveryBlue}
              label="Recovery"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              icon={LogoBlack}
              iconFocused={DashboardIcon}
              label="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cardio"
        component={CardioScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              icon={Cardio}
              iconFocused={CardioBlue}
              label="Cardio"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Supplement"
        component={SupplementScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              icon={Supplement}
              iconFocused={SupplementBlue}
              label="Supplement"
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// ✅ Main Stack Navigator (LoginScreen is separate)
export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{headerShown: false}}>
        {/* LoginScreen is independent, no bottom tabs */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />

        {/* Main App Navigation (with bottom tabs) */}
        <Stack.Screen name="Details" component={BottomTabNavigator} />
        <Stack.Screen name="Main" component={DetailsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
