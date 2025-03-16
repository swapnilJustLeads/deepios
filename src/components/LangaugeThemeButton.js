import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Button} from '@rneui/themed';
import LanguageSwitch from './LanguageSwitch';
import {useTranslation} from 'react-i18next';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const buttonWidth = (screenWidth - 48) / 2;

import LightButton from '../assets/images/light-button.svg';
import MoonButton from '../assets/images/moon-svgrepo-com.svg';
import {useTheme} from '../hooks/useTheme';
import {toggleTheme} from '../theme/theme';
import {useDispatch} from 'react-redux';
import { useAuth } from '../firebase/hooks';
import { useNavigation } from '@react-navigation/native';
const LanguageThemeLogout = ({style}) => {
   const navigation =  useNavigation()
  const {logout } = useAuth()
  const {isDarkMode, theme} = useTheme();
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const [language, setLanguage] = useState('English'); // Default language


  const changeTheme = () => {
    dispatch(toggleTheme());
  };

  const signOut = () => {
    logout();
    navigation.navigate('LoginScreen')
    
  }

  return (
    <View style={[styles.container, style]}>
      <LanguageSwitch />
      <View style={styles.row}>
        <TouchableOpacity onPress={changeTheme}>
          {isDarkMode ? (
            <LightButton />
          ) : (
            <TouchableOpacity
              onPress={changeTheme}
              style={{}}>
              <MoonButton width={30} height={20} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <Button
        onPress={signOut}
          containerStyle={styles.containerStyle}
          title={<Text style={styles.logoutText}>{t('logout')}</Text>}
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
    backgroundColor: 'transparent',
    width: '100%',
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
    backgroundColor: '#00e5ff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 7,
    paddingRight: 7,
  },
  containerStyle: {
    height: 22,
  },
  logoutText: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: '800',
    color: 'Black',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
});

export default LanguageThemeLogout;