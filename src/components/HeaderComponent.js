import React, { useEffect, useState } from 'react';
import { Header } from '@rneui/themed';
import { TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Dashboardlogo from '../assets/images/dashboardlogo.svg';
import Rightlogo from '../assets/images/rightlogo.svg';
import { useUserDetailsContext } from '../context/UserDetailsContext';

const HeaderComponent = () => {
  const navigation = useNavigation();
  const { userDetails } = useUserDetailsContext();
  const [profileImage, setProfileImage] = useState('');
  
  useEffect(() => {
    console.log('🔍 Current userDetails from context:', userDetails);

    if (userDetails) {
      setProfileImage(userDetails.profilePicture || '');
    }
  }, [userDetails]);

  return (
    <Header
      containerStyle={{
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
      }}
      centerComponent={
        <TouchableOpacity>
          <Dashboardlogo width={146} height={42} />
        </TouchableOpacity>
      }
      rightComponent={
        <TouchableOpacity 
          style={{ marginRight: 9, marginTop: 5 }} 
          onPress={() => navigation.navigate('Home', { screen: 'ProfileScreen' })}
        >
          {profileImage && profileImage.trim() !== '' ? (
            <Image
              source={{ uri: profileImage }}
              style={{ 
                width: 33, 
                height: 33, 
                borderRadius: 16.5
              }}
            />
          ) : (
            <Rightlogo width={33} height={33} />
          )}
        </TouchableOpacity>
      }
    />
  );
};

export default HeaderComponent;