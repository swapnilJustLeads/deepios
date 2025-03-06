import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useGlobalContext } from '../context/GlobalContext';
import { Icon } from '@rneui/themed';

const ThemeToggle = () => {
  const { theme, setTheme } = useGlobalContext();

  return (
    <TouchableOpacity
      onPress={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      style={[styles.button, theme === 'dark' ? styles.darkMode : styles.lightMode]}
    >
      <Icon
        name={theme === 'dark' ? 'sunny' : 'moon'}
        type="ionicon"
        color={theme === 'dark' ? '#000' : '#fff'}
        size={18}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 5,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkMode: {
    backgroundColor: '#fff',
  },
  lightMode: {
    backgroundColor: '#333',
  },
});

export default ThemeToggle;
