import { useSelector } from 'react-redux';

import { lightTheme, darkTheme } from './themeSlice';
export const useTheme = () => {
  const isDarkMode = useSelector((state) => state.theme.darkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
 
  
  return {
    isDarkMode,
     theme,
   themeMode: isDarkMode ? 'dark' : 'light'
  };
};