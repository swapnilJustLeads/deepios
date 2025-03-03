import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Button } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement } from '../redux/slices/counterSlice';
import { toggleTheme } from '../theme/theme';
import { useTranslation } from 'react-i18next';

export default function HomeScreen({ navigation }) {
  const count = useSelector((state) => state.counter.value);
  const isDarkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const backgroundColor = isDarkMode ? '#000000' : '#B0B0B0';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor }}>
      <Text style={{ fontSize: 20, color: textColor, marginBottom: 20 }}>{t('welcome')}</Text>
      <Text style={{ fontSize: 20, color: textColor, marginBottom: 20 }}>{t('counter')}: {count}</Text>

      <Button title={t('increment')} onPress={() => dispatch(increment())} />
      <Button title={t('decrement')} onPress={() => dispatch(decrement())} containerStyle={{ marginTop: 10 }} />
      
      <Button title={t('toggleTheme')} onPress={() => dispatch(toggleTheme())} containerStyle={{ marginTop: 20 }} />
      
      <Button
        title={t('changeLang')}
        onPress={() => i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en')}
        containerStyle={{ marginTop: 10 }}
      />
      
      <Button title={t('details')} onPress={() => navigation.navigate('Details')} containerStyle={{ marginTop: 20 }} />
    </View>
  );
}
