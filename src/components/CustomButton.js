import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Button as RNEButton } from '@rneui/themed';

const CustomButton = ({ title = 'NEW INTAKE', onPress = () => {} }) => {
  return (
    <RNEButton 
    containerStyle={styles.containerStyle}
      buttonStyle={styles.button}
      titleStyle={styles.buttonText}
      onPress={onPress}
      title={title}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    width: 100,

    backgroundColor: '#00E5FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: '900',
    color: '#000000',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  containerStyle:{
    alignSelf:'center'
  }
});

export default CustomButton;

