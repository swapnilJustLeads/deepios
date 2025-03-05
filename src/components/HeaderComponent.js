import React from 'react';
import { Header } from '@rneui/themed';
import Dashboardlogo from '../assets/dashboardlogo.svg';
import Rightlogo from '../assets/rightlogo.svg';
import LeftLogo from '../assets/LeftLogo.svg';

const HeaderComponent = ( ) => {
  return (
    <Header
      containerStyle={{
        backgroundColor: 'transparent', // Keep background transparent if needed
        paddingHorizontal: 30,
        
        borderBottomWidth: 0, // Remove border if not needed
      }}
      leftComponent={<LeftLogo width={50} height={50} />}
      centerComponent={<Dashboardlogo width={154} height={50} />}
      rightComponent={<Rightlogo width={50} height={50} />}
    />
  );
};

export default HeaderComponent;
