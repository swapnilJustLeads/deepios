// themeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';

// Get initial theme from device settings
const initialState = {
  darkMode: Appearance.getColorScheme() === 'dark',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
  },
});

export const { toggleTheme, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;

// Theme constants
export const lightTheme = {
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
  primaryColor: '#00e5ff',
  secondaryColor: '#f3f4f6',
};

export const darkTheme = {
  backgroundColor: '#121212',
  textColor: '#FFFFFF',
  primaryColor: '#00b8cc',
  secondaryColor: '#2a2a2a',
};