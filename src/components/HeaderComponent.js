import React from 'react';
import { Header } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // ✅ Import navigation hook
import Dashboardlogo from '../assets/images/dashboardlogo.svg';
import Rightlogo from '../assets/images/rightlogo.svg';
import LogoWhite from '../assets/images/Logo-white.svg';
import { useTheme } from '../hooks/useTheme';

const HeaderComponent = () => {
    const {  isDarkMode } = useTheme();
  const navigation = useNavigation(); // ✅ Get navigation instance

  return (
    <Header
      containerStyle={{
        backgroundColor: 'transparent', // Keep background transparent if needed
        // paddingHorizontal: 30,

        borderBottomWidth: 0, // Remove border if not needed
      }}
      centerComponent={
        <TouchableOpacity>
        {isDarkMode? <LogoWhite width={146} height={42} />: <Dashboardlogo width={146} height={42} /> }
        </TouchableOpacity>
      }
      rightComponent={
        <TouchableOpacity style={{ marginRight:9, marginTop:5}} onPress={()=>navigation.navigate('Home', { screen: 'ProfileScreen' })}>
          <Rightlogo width={33} height={33} />
        </TouchableOpacity>
      }
    />
  );
};

export default HeaderComponent;
