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
        bottom !== undefined ? {bottom} : null, // Allows bottom: 0 as well
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
  },
  container: {
    width: '50%',
    borderRadius: 12,
  },
});
