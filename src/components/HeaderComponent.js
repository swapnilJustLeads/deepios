import React from 'react';
import {Header} from '@rneui/themed';
import Dashboardlogo from '../assets/images/dashboardlogo.svg';
import Rightlogo from '../assets/images/rightlogo.svg';
import LeftLogo from '../assets/images/LeftLogo.svg';
import {TouchableOpacity} from 'react-native';

const HeaderComponent = () => {
  return (
    <Header
      containerStyle={{
        backgroundColor: 'transparent', // Keep background transparent if needed
        // paddingHorizontal: 30,

        borderBottomWidth: 0, // Remove border if not needed
      }}
      // leftComponent={
      //   <TouchableOpacity>
      //     <LeftLogo width={50} height={50} />
      //   </TouchableOpacity>
      // }
      centerComponent={
        <TouchableOpacity>
          <Dashboardlogo width={146} height={42} />
        </TouchableOpacity>
      }
      rightComponent={
        <TouchableOpacity style={{ marginRight:9, marginTop:5}} >
          <Rightlogo width={33} height={33} />
        </TouchableOpacity>
      }
    />
  );
};

export default HeaderComponent;
