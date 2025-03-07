import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import HeaderComponent from '../components/HeaderComponent';
import {Button} from '@rneui/themed';
import SupplmentFormComponent from '../components/SupplmentFormComponent';
import SupplementLayout from '../components/SupplementLayout';
import HorizontalDatePicker from '../components/HorizontalDatePicker';

const SupplementScreen = () => {
  const [showForm, setshowForm] = useState(false);
  return (
    <View style={styles.container}>
      <HeaderComponent />
      <HorizontalDatePicker />
      {showForm ? (
        <>
          <SupplmentFormComponent />
          <View style={styles.bottomButtonRow}>
            {/* <CustomButton /> */}
            <Button
              containerStyle={{marginLeft: 21}}
              onPress={() => setshowForm(true)}
              buttonStyle={[
                styles.buttonStyle,
                {
                  backgroundColor: '#fff',
                },
              ]}
              title="Delete"
              titleStyle={styles.buttonTextStyle}
            />
            <Button
              containerStyle={{marginRight: 21}}
              onPress={() => setshowForm(true)}
              buttonStyle={[styles.buttonStyle]}
              title="Save"
              titleStyle={styles.buttonTextStyle}
            />
          </View>
        </>
      ) : (
        <>
          <SupplementLayout />
          <View style={styles.bottomButton}>
            {/* <CustomButton /> */}
            <Button
              onPress={() => setshowForm(true)}
              buttonStyle={styles.buttonStyle}
              title="New Intake"
              style={[styles.buttonContainer]}
              titleStyle={styles.buttonTextStyle}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default SupplementScreen;

const styles = StyleSheet.create({
  bottomButton: {
    position: 'absolute',
    bottom: 21,
    width: '100%',
    alignSelf: 'center',
  },
  bottomButtonRow: {
    position: 'absolute',
    bottom: 21,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#AFAFAF',
  },
  buttonStyle: {
    width: 100,
    backgroundColor: '#00E5FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextStyle: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: '900',
    color: '#000000',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
