import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState({
    authLoading: true,
    userDetailsLoading: true,
    workoutDataLoading: true,
    cardioDataLoading: false,
    supplementDataLoading: false,
    recoveryDataLoading: false,
    journalLoading: false,
  });

  // Get saved theme or use system preference
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      setTheme(savedTheme || Appearance.getColorScheme() || 'dark');
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <GlobalContext.Provider value={{ globalLoading, setGlobalLoading, theme, toggleTheme }}>
      {children}
    </GlobalContext.Provider>
  );
};
