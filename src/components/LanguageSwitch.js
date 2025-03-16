import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageSwitch = ({ onLanguageChange = () => {} }) => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Load saved language on component mount
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('userLanguage');
        if (savedLanguage) {
          setSelectedLanguage(savedLanguage);
          i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      }
    };

    loadSavedLanguage();
  }, [i18n]);

  const handleLanguageSwitch = async (languageCode) => {
    try {
      // Set state
      setSelectedLanguage(languageCode);
      
      // Change language in i18n
      await i18n.changeLanguage(languageCode);
      
      // Save preference to storage
      await AsyncStorage.setItem('userLanguage', languageCode);
      
      // Call callback if provided
      onLanguageChange(languageCode);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <View style={styles.container}>
       
      <TouchableOpacity
        style={[
          styles.button,
          selectedLanguage === 'en' && styles.selectedButton,
        ]}
        onPress={() => handleLanguageSwitch('en')}
      >
        <Text style={[
          styles.buttonText,
          selectedLanguage === 'en' && styles.selectedButtonText
        ]}>
          English
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.button,
          selectedLanguage === 'de' && styles.selectedButton,
        ]}
        onPress={() => handleLanguageSwitch('de')}
      >
        <Text style={[
          styles.buttonText,
          selectedLanguage === 'de' && styles.selectedButtonText
        ]}>
          Deutsch
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: 127.52,
    height: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  button: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedButton: {
    backgroundColor: '#00E5FF',
  },
  buttonText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 22,
  },
  selectedButtonText: {
    color: '#000000',
  }
});

export default LanguageSwitch;