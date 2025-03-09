import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {Button} from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { useGlobalContext } from '../context/GlobalContext';


import Light from '../assets/images/light-button.svg';
import { useTheme } from '../hooks/useTheme';
import { toggleTheme } from '../theme/theme';

const LanguageThemeLogout = ({style}) => {
  const dispatch = useDispatch();
  
  const { colors, isDarkMode } = useTheme();
  const [language, setLanguage] = useState('English'); // Default language
  const { theme, setTheme } = useGlobalContext();

  const toggleLanguage = () => {
    setLanguage(language === 'English' ? 'Deutsch' : 'English');
  };

  const lightThemeFunction = () => {
    dispatch(toggleTheme())
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.languageSelector}>
        <Button
          title={<Text style={styles.logoutText}>English</Text>}
          buttonStyle={
            language === 'English'
              ? styles.activeLanguage
              : styles.languageButton
          }
          titleStyle={styles.languageText}
          onPress={() => setLanguage('English')}
        />
        <Button
          title={<Text style={styles.logoutText}>Deutsch</Text>}
          buttonStyle={
            language === 'Deutsch'
              ? styles.activeLanguage
              : styles.languageButton
          }
          titleStyle={styles.languageText}
          onPress={() => setLanguage('Deutsch')}
        />
      </View>
      <Text> {theme} {isDarkMode ? 'Dark' : 'Light'} </Text>
      <View style={{flexDirection:'row', gap:9}} >
        <TouchableOpacity onPress={lightThemeFunction} >
        <Light height={30} width={30} />

        </TouchableOpacity>

        <Button
          title={<Text style={styles.logoutText}>Logout</Text>}
          buttonStyle={styles.logoutButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 22,
    width: '100%',
    alignSelf: 'flex-end',
  },
  languageSelector: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    height: 28,
    width: 127.52,
  },
  languageButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  activeLanguage: {
    backgroundColor: '#00e5ff',
  },
  languageText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 22,
  },
  themeButton: {
    width: 31,
    height: 30,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    width: 65,
    height: 30,
    backgroundColor: '#00e5ff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '800',
    color: 'Black',
  },
});

export default LanguageThemeLogout;
