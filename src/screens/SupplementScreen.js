import { StyleSheet, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import HeaderComponent from '../components/HeaderComponent';
import { Button } from '@rneui/themed';
import moment from 'moment';
import SupplmentFormComponent from '../components/SupplmentFormComponent';
import SupplementLayout from '../components/SupplementLayout';
import HorizontalDatePicker from '../components/HorizontalDatePicker';

// ✅ Import Supplement Context
import { useUserSupplementContext } from '../context/UserContexts/SupplementContext';

const SupplementScreen = (prop) => {
  const [showForm, setshowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  const { supplementData } = useUserSupplementContext(); // ✅ Fetch context data

  useEffect(() => {
    console.log("🔥 Supplement Data from Context (Screen):", supplementData);
  }, [supplementData]); // Log when data changes

  const closeForm = () => {
    setshowForm(false);
  };

  return (
    <View style={styles.container}>
      <HeaderComponent />
      <HorizontalDatePicker />

      {showForm ? (
        <>
          <SupplmentFormComponent save={closeForm} />
          <View style={styles.bottomButtonRow}>
            <Button
              containerStyle={{ marginLeft: 21 }}
              onPress={() => setshowForm(true)}
              buttonStyle={[styles.buttonStyle, { backgroundColor: '#fff' }]}
              title="Delete"
              titleStyle={styles.buttonTextStyle}
            />
            <Button
              containerStyle={{ marginRight: 21 }}
              onPress={() => setshowForm(false)}
              buttonStyle={[styles.buttonStyle]}
              title="Save"
              titleStyle={styles.buttonTextStyle}
            />
          </View>
        </>
      ) : (
        <>
          <SupplementLayout selectedDate={selectedDate} />
          <View style={styles.bottomButton}>
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
