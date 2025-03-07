import React, { useState } from 'react';
import { View, Text, StyleSheet,Dimensions } from 'react-native';
import { Button } from '@rneui/themed';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const buttonWidth = (screenWidth - 48) / 2;
const LanguageThemeLogout = ({ style }) => {
  const [language, setLanguage] = useState('English'); // Default language

  const toggleLanguage = () => {
    setLanguage(language === 'English' ? 'Deutsch' : 'English');
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.languageSelector}>
        <Button 
           title={
            <Text style={styles.logoutText}>English</Text>
          }
          buttonStyle={language === 'English' ? styles.activeLanguage : styles.languageButton}
          titleStyle={styles.languageText}
          onPress={() => setLanguage('English')}
        />
        <Button 
            title={
                <Text style={styles.logoutText}>Deutsch</Text>
              }
          buttonStyle={language === 'Deutsch' ? styles.activeLanguage : styles.languageButton}
          titleStyle={styles.languageText}
          onPress={() => setLanguage('Deutsch')}
        />
      </View>

      <Button
        icon={{ name: 'settings', type: 'feather', size: 15, color: '#000' }}
        buttonStyle={styles.themeButton}
      />

      <Button
         title={
            <Text style={styles.logoutText}>Logout</Text>
          }
        buttonStyle={styles.logoutButton}
      />
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
    width:'100%'
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
    bo
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

