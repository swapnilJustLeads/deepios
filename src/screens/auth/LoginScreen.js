import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Button, Input} from '@rneui/themed';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../firebase/hooks/auth'; // ✅ Import useAuth hook
import Toast from 'react-native-toast-message';
import Logo from '../../assets/images/logo.svg';
import { color } from '@rneui/base';

export default function LoginScreen() {
  const isDarkMode = useSelector(state => state.theme.darkMode);
  const {t, i18n} = useTranslation();
  const navigation = useNavigation();
  const {login, loading, initialized, user, navigate} = useAuth(); // ✅ Use useAuth for authentication

  const [email, setEmail] = useState('swap@justgetleads.com');
  const [password, setPassword] = useState('swap@123');

  const backgroundColor = isDarkMode ? '#000000' : '#000000';

  useEffect(() => {
    // Only redirect if auth is initialized and user exists
    if ( user && user.uid) {
      // navigate("/dashboard");
      navigation.navigate('Details'); 
    }
  }, [ user, navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({type: 'error', text1: 'Please enter email and password'});
      return;
    }

    try {
      console.log('🟢 Attempting to login...');
      const user = await login(email, password); // ✅ Call login from useAuth()
      if (user) {
        console.log('✅ Login successful:', user);
        navigation.navigate('Details'); // ✅ Navigate to Details screen after login
      }
    } catch (error) {
      console.error('🔴 Login Error:', error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor,
      }}>
      <Logo width={270} height={65} />
 
      <View style={{height: 21}} />
      <Input
        labelStyle={{ color: 'white' }}
        inputContainerStyle={{ borderBottomColor: '#E5E7EB', color: 'white' }}
        inputStyle={styles.inputText}
        placeholder="eMail"
        placeholderTextColor="white"
        containerStyle={{ width: '50%' }}
        value={email}
        onChangeText={setEmail}
      />
      <Input
        inputContainerStyle={{ borderBottomColor: '#E5E7EB' }}
        inputStyle={styles.inputText}
        placeholder="Password"
        placeholderTextColor="white"
        containerStyle={{ width: '50%' }}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
     <Button
      onPress={handleLogin}
      title={loading ? 'Logging in...' : 'LOGIN'}
      buttonStyle={{ 
        backgroundColor: '#00E5FF',  // Same background color for both states
        height: 40 // Optional: standard height for the button
      }}
      titleStyle={{
        color: '#000',
        fontFamily: 'Inter',
        fontWeight: '900',
        textTransform: 'uppercase',
      }}
      containerStyle={{ 
        width: 133, 
        borderRadius: 8
      }}
      disabled={loading}
      disabledStyle={{ 
        backgroundColor: '#00E5FF'  // Keep same background color when disabled
      }}
      disabledTitleStyle={{
        color: '#000'  // Keep same text color when disabled
      }}
      loading={loading}
      loadingProps={{ 
        color: '#000'  // Color of the loading indicator
      }}
    />
    </View>
  );
}

const styles = {
  inputText: {
    color: 'white',
  },
};