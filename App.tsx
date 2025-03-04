import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './src/redux/store';
import Navigation from './src/navigation/Navigation';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setTheme } from './src/theme/theme';
import './src/i18n/i18n'; // Load i18n configurations
//init
export default function App() {
  return (
    <Provider store={store}>
      <ThemeInitializer />
      <Navigation />
    </Provider>
  );
}

const ThemeInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        dispatch(setTheme(JSON.parse(savedTheme)));
      } else {
        dispatch(setTheme(Appearance.getColorScheme() === 'dark'));
      }
    };
    loadTheme();
  }, [dispatch]);

  return null;
};
