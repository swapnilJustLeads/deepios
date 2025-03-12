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
import BardumbleWhite from '../assets/images/workout-white.svg';
import Supplementwhite from '../assets/images/Supplement-white.svg';
import MainIconwhite from '../assets/images/Main-iconwhite.svg';
import Cardio from '../assets/images/cardio.svg';
import CardioWhite from '../assets/images/Cardio-white.svg';
import CardioBlue from '../assets/images/cardio-blue.svg';
import Recovery from '../assets/images/recovery.svg';
import RecoveryBlue from '../assets/images/recovery-blue.svg';
import RecoveryWhite from '../assets/images/recovery-white.svg';
import WorkoutScreen from '../screens/WorkoutScreen';
import SupplementScreen from '../screens/SupplementScreen';
import RecoveryScreen from '../screens/RecoveryScreen';
import CardioScreen from '../screens/CardioScreen';
import {Text, View} from 'react-native';
import ProfileScreen from '../screens/ProfileScreen';
import { useTheme } from '../hooks/useTheme';

// Stack & Tab Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({icon, iconFocused, label, focused}) => {
  const IconComponent = focused ? iconFocused : icon;
  const iconSize = label === 'Home' ? (focused ? 51 : 32) : 32; // Bigger size for Home icon

  return (
    <View style={{
      alignItems: 'center', 
      width: 70,
      marginTop: 6,
      gap:40
    }}>
      {' '}
      {/* Ensure enough space */}
      <IconComponent width={iconSize} height={iconSize} />
     
    </View>
  );
};

// Create a Home stack navigator that includes HomeScreen and ProfileScreen
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

// Custom tab bar pressable component to handle the home tab click
const MyTabBar = ({state, descriptors, navigation}) => {
  const {isDarkMode} = useTheme()
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
      height: 80,
      elevation: 10,
      paddingTop: 15,
    }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            if (route.name === 'Home') {
              // Special handling for Home tab to reset to HomeMain screen
              navigation.navigate({name: 'Home', params: { screen: 'HomeMain' }});
            } else {
              navigation.navigate({name: route.name, merge: true});
            }
          } else if (isFocused && route.name === 'Home') {
            // If already on Home tab and it's pressed again, navigate to HomeMain
            navigation.navigate('Home', { screen: 'HomeMain' });
          }
        };

        return (
          <View 
            key={index}
            style={{
              flex: 1,
              alignItems: 'center',
            }}
          >
            <View 
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onTouchEnd={onPress}
            >
              {options.tabBarIcon && options.tabBarIcon({
                focused: isFocused,
                color: '',
                size: 0,
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
};

// ✅ Bottom Tab Navigator (Tabs are only shown after login)
const BottomTabNavigator = () => {
  const {isDarkMode} = useTheme()

  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false, // Hide top header
        tabBarShowLabel: false, // Hide labels
      }}>
      <Tab.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              icon={isDarkMode ? BardumbleWhite: Bardumble}
              iconFocused={BardumbleBlue}
              label="Workout"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Recovery"
        component={ RecoveryScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              icon={isDarkMode ? RecoveryWhite:Recovery}
              iconFocused={RecoveryBlue}
              label="Recovery"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeStack} // Using HomeStack instead of direct HomeScreen
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              icon={isDarkMode ? MainIconwhite: LogoBlack}
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
              icon={isDarkMode ? CardioWhite:  Cardio}
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
              icon={isDarkMode ?Supplementwhite: Supplement}
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
        {/* No need for Profile screen here anymore as it's part of HomeStack */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}