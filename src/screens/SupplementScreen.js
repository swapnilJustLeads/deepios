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
  const [selectedSupplement, setSelectedSupplement] = useState(null);

  const { supplementData, setRefresh } = useUserSupplementContext(); // ✅ Fetch context data

  useEffect(() => {
    // Filter workouts for today's date on initial load
    const today = moment().format('YYYY-MM-DD');
    onDateSelect(today);
  }, [supplementData]); // 🔥 Run this effect whenever `workoutData` changes
  const onDateSelect = (selectedDate) => {
    console.log("📅 Selected Date:", selectedDate);
    setSelectedDate(selectedDate); // ✅ Update selected date state properly
  };

  const closeForm = () => {
    setshowForm(false);
    setSelectedSupplement(null);
  };

  const handleFormSave = () => {
    setshowForm(false);  // Hide the form
    setSelectedSupplement(null); // Reset selected supplement
    setRefresh(prev => !prev); // Toggle refresh to trigger data reload
  };

  // Handle selection of a supplement item
  const handleSelectSupplement = (supplementsData) => {
    setSelectedSupplement(supplementsData);
    setshowForm(true);
  };

  return (
    <View style={styles.container}>
      <HeaderComponent />

      {showForm ? (
        // Form view - no date picker here
        <>
          {selectedSupplement ? (
            <SupplmentFormComponent
              supplementData={selectedSupplement}
              save={closeForm}
              onSave={handleFormSave}
            />
          ) : (
            // For new supplement
            <SupplmentFormComponent
              save={closeForm}
              onSave={handleFormSave}
            />
          )}
        </>
      ) : (
        // List view - include date picker here
        <>
          <HorizontalDatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            minDate={moment().subtract(30, 'days').format('YYYY-MM-DD')}
            maxDate={moment().add(30, 'days').format('YYYY-MM-DD')}
            onCalendarOpen={() => console.log('Calendar opened')}
            onCalendarClose={() => console.log('Calendar closed')}
            onDateSelect={onDateSelect}
          />

          <SupplementLayout
            selectedDate={selectedDate}
            onSelectSupplement={handleSelectSupplement}
          />

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