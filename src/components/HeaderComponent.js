import React from 'react';
import { Header } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // ✅ Import navigation hook
import Dashboardlogo from '../assets/images/dashboardlogo.svg';
import Rightlogo from '../assets/images/rightlogo.svg';
import LeftLogo from '../assets/images/LeftLogo.svg';

const HeaderComponent = () => {
  const navigation = useNavigation(); // ✅ Get navigation instance

  return (
    <Header
      containerStyle={{
        backgroundColor: 'transparent', 
        paddingHorizontal: 30,
        borderBottomWidth: 0,
      }}
      leftComponent={
        <TouchableOpacity>
          <LeftLogo width={50} height={50} />
        </TouchableOpacity>
      }
      centerComponent={
        <TouchableOpacity>
          <Dashboardlogo width={154} height={50} />
        </TouchableOpacity>
      }
      rightComponent={
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}> {/* ✅ Navigate to ProfileScreen */}
          <Rightlogo width={50} height={50} />
        </TouchableOpacity>
      }
    />
  );
};

export default HeaderComponent;
