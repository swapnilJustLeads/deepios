import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function DetailsScreen({ navigation }) {
  const isDarkMode = useSelector((state) => state.theme.darkMode);
  const { t } = useTranslation();

  const backgroundColor = isDarkMode ? '#000000' : '#B0B0B0';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor }}>
      <Text style={{ fontSize: 20, color: textColor, marginBottom: 20 }}>{t('details')}</Text>
      <Button title={t('back')} onPress={() => navigation.goBack()} />
    </View>
  );
}
