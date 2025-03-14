import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import React, {useState,useEffect} from 'react';
import HeaderComponent from '../components/HeaderComponent';
import WorkoutCard from '../components/WorkoutCard';
import Cardio from '../assets/images/cardio.svg';
import moment from 'moment';
import HorizontalDatePicker from '../components/HorizontalDatePicker';
import {Button} from '@rneui/themed';
import CardioForm from '../components/CardioForm';
import {
  useUserCardioContext,
} from '../context/UserContexts';
import {
  getStartAndEndDate,
  calculateTotalCardioTime,
} from '../utils/calculate';
import WorkoutLayout from '../components/WorkoutLayout';
import CardioLayout from '../components/CardioLayout';
import {
  useFocusEffect,
  createStaticNavigation,
} from '@react-navigation/native';

const CardioScreen = () => {
  const [showForm, setshowForm] = useState(false);
  const [selectedCardio, setSelectedCardio] = useState(null);
  const { cardioData, setRefresh, refresh } = useUserCardioContext();
  const [filteredWorkoutData, setFilteredWorkoutData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    
    moment().format('YYYY-MM-DD'),
  );
  useFocusEffect(
    React.useCallback(() => {
      
      // Do something when the screen is focused
      return () => {
        setshowForm(false)
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  )

  useEffect(() => {
    console.log("🔥 cardioData on load:", cardioData); // ✅ Check if cardio data exists
    const today = moment().format('YYYY-MM-DD');
    onDateSelect(today);
  }, [cardioData]); // Runs whenever `cardioData` updates
  
  const onDateSelect = (selectedDate) => {
    console.log("📅 Selected Date:", selectedDate);
    setSelectedDate(selectedDate);
    const filteredCardioData = cardioData.filter((item) => {
      if (item.createdAt) {
        const itemDate = moment.unix(item.createdAt.seconds).format("YYYY-MM-DD");
        return itemDate === selectedDate;
      }
      return false;
    });
  
    console.log("📊 Filtered Cardio Data:", filteredCardioData);
    setFilteredWorkoutData(filteredCardioData);
  };
  
  const filterDataByRange = (data, range) => {
    const { startDate, endDate } = getStartAndEndDate(range);
    return data.filter((item) => {
      if (item.createdAt) {
        const itemDate = new Date(item.createdAt.seconds * 1000);
        return itemDate >= startDate && itemDate <= endDate;
      }
      return false;
    });
  };

  const cardioTimeToday = calculateTotalCardioTime(
    filterDataByRange(cardioData, 'Today'),
    'time'
  );
  const cardioTimeWeek = calculateTotalCardioTime(
    filterDataByRange(cardioData, 'Week'),
    'time'
  );
  const cardioTimeMonth = calculateTotalCardioTime(
    filterDataByRange(cardioData, 'Month'),
    'time'
  );

  const handleFormSave = () => {
    setshowForm(false);  // Hide the form
    setSelectedCardio(null); // Reset selected cardio
    setRefresh(prev => !prev); // Toggle refresh to trigger data reload
  };

  // Handler for when a cardio item is clicked
  const handleSelectCardio = (cardioItem) => {
    console.log("Selected cardio item:", cardioItem);
    setSelectedCardio(cardioItem);
    setshowForm(true);
  };

  return (
    <View style={styles.container}>
      <HeaderComponent />
      {showForm ? (
        <CardioForm   
          onSave={handleFormSave} 
          onCancel={() => {
            setshowForm(false);
            setSelectedCardio(null);
          }}
          cardioData={selectedCardio}  // Pass the selected cardio data to the form
        />
      ) : (
        <>
          <WorkoutCard
            image={<Cardio width={50} height={50} />}
            name="Cardio"
            todayValue={cardioTimeToday}
            weekValue={cardioTimeWeek}
            monthValue={cardioTimeMonth}
            unit={'min'}
          />
          <HorizontalDatePicker 
            value={selectedDate}
            onChange={setSelectedDate}
            minDate={moment().subtract(30, 'days').format('YYYY-MM-DD')}
            maxDate={moment().add(30, 'days').format('YYYY-MM-DD')}
            onCalendarOpen={() => console.log('Calendar opened')}
            onCalendarClose={() => console.log('Calendar closed')}
            onDateSelect={onDateSelect}
          />
          {/* <CardioLayout 
            title="Cardio" 
            type="cardio" 
            selectedDate={selectedDate} 
            onSelectItem={handleSelectCardio}  // Add the handler for item selection
          /> */}
          <WorkoutLayout 
            title="Cardio" 
            selectedDate={selectedDate} 
            onSelectItem={handleSelectCardio}
            type="cardio"
          />

          <View style={styles.bottomButton}>
            <Button
              onPress={() => setshowForm(true)}
              buttonStyle={styles.buttonStyle}
              title="New CARDIO"
              titleStyle={styles.buttonTextStyle}
            />
          </View>
        </>
      )}

    </View>
  );
};

export default CardioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AFAFAF',
  },
  flatListContainer: {
    alignItems: 'center',
  },
  dateItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedDate: {
    backgroundColor: 'black',
  },
  dateText: {
    fontSize: 16,
    color: 'black',
  },
  selectedDateText: {
    color: 'white',
    fontWeight: 'bold',
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
  bottomButton: {
    position: 'absolute',
    bottom: 21,
    alignSelf: 'center',
  },
});