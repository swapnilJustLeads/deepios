import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../firebase/hooks/auth'; // ✅ Import useAuth hook
import Toast from 'react-native-toast-message';
import Logo from '../../assets/images/logo.svg';

export default function LoginScreen() {
  const isDarkMode = useSelector((state) => state.theme.darkMode);
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { login, loading } = useAuth(); // ✅ Use useAuth for authentication

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const backgroundColor = isDarkMode ? '#000000' : '#000000';

  const handleLogin = async () => {
    // if (!email || !password) {
    //   Toast.show({ type: 'error', text1: 'Please enter email and password' });
    //   return;
    // }

    // try {
    //   console.log('🟢 Attempting to login...');
    //   const user = await login(email, password); // ✅ Call login from useAuth()
    //   if (user) {
    //     console.log('✅ Login successful:', user);
        navigation.navigate('Details'); // ✅ Navigate to Details screen after login
    //   }
    // } catch (error) {
    //   console.error('🔴 Login Error:', error);
    // }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor }}>
      <Logo width={270} height={65} />
      <View style={{ height: 21 }} />
      <Input 
        placeholder='eMail' 
        containerStyle={{ width: '50%' }} 
        value={email} 
        onChangeText={setEmail} 
      />
      <Input 
        placeholder='Password' 
        containerStyle={{ width: '50%' }} 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      <Button 
        onPress={handleLogin} 
        title={loading ? "Logging in..." : "LOGIN"} 
        buttonStyle={{ backgroundColor: '#00E5FF' }} 
        titleStyle={{ color: '#000' }} 
        containerStyle={{ width: '50%', borderRadius: 12 }} 
        disabled={loading} 
      />
    </View>
  );
}
