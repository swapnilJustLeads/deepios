// src/hooks/useTheme.js
import { useSelector } from 'react-redux';
import { lightColors, darkColors } from '../theme/colors';

export const useTheme = () => {
  const isDarkMode = useSelector((state) => state.theme.darkMode);
  
  return {
    colors: isDarkMode ? darkColors : lightColors,
    isDarkMode,
  };
};