import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement } from '../redux/slices/counterSlice';
import { toggleTheme } from '../theme/theme';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';
import Logo from '../assets/logo.svg';
export default function HomeScreen({ navigation }) {
  const count = useSelector((state) => state.counter.value);
  const isDarkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const backgroundColor = isDarkMode ? '#000000' : '#000000';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor }}>
        <Logo width={270} height={65} />
        <View style={{height:21}} />
        <Input placeholder='eMail' containerStyle={{width:'50%'}} />
        <Input placeholder='Password' containerStyle={{width:'50%'}} />
        <Button onPress={()=> navigation.navigate('Details')} title="LOGIN" buttonStyle={{backgroundColor:'#00E5FF'}} titleStyle={{
          color:'#000',
        }} containerStyle={{width:'50%', borderRadius:12}} />
    
    </View>
  );
}
