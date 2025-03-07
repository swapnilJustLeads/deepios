import {StyleSheet} from 'react-native';
import React from 'react';
import {Button} from '@rneui/themed';

const DefaultButton = ({title, alignSelf, onPress, position, bottom}) => {
  return (
    <Button
      onPress={onPress}
      title={title}
      buttonStyle={styles.button}
      titleStyle={styles.title}
      containerStyle={[
        styles.container,
        alignSelf ? {alignSelf} : null,
        position ? {position} : null,
        bottom !== undefined ? {bottom} : null,
      ]}
    />
  );
};

export default DefaultButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00E5FF',
  },
  title: {
    color: '#000',
    fontWeight: '900',
    fontSize: 13,
    fontFamily:'Inter',
    margin:1
  },
  container: {
    width: '39%',
    borderRadius: 12,
  },
});
