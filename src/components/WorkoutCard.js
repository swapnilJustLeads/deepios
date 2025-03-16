import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Card} from '@rneui/themed';

const WorkoutCard = props => {
  const [selectedTab, setSelectedTab] = useState('Today');
  
  // Get the appropriate value based on selected tab
  const getValueForSelectedTab = () => {
    if (props.todayValue !== undefined && 
        props.weekValue !== undefined && 
        props.monthValue !== undefined) {
      
      switch(selectedTab) {
        case 'Today':
          return props.todayValue;
        case 'Week':
          return props.weekValue;
        case 'Month':
          return props.monthValue;
        default:
          return props.unitNumber || 0;
      }
    }
    return props.unitNumber || 0;
  };
  
  return (
    <Card containerStyle={styles.card}>
      <View style={styles.header}>
        <Text style={styles.workoutText}>{props?.name}</Text>
        <View style={styles.tabs}>
          {['Today', 'Week', 'Month'].map((tab, index) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                selectedTab === tab && styles.selectedTab,
                index === 0 && selectedTab === tab && styles.leftRounded, // "Today"
                index === 2 && selectedTab === tab && styles.rightRounded, // "Month"
                index === 1 && selectedTab === tab && styles.middleTab, // "Week"
              ]}
              onPress={() => setSelectedTab(tab)}>
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.selectedTabText,
                ]}>
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={{height:9}} />
      
      {/* Data Section */}
      <View style={styles.dataWrapper}>
        <View style={styles.imageContainer}>{props.image}</View>

        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>{getValueForSelectedTab()}</Text>
          <Text style={styles.unitText}>{props.unit}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    borderRadius: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderColor: 'black',
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -5,
    marginTop: -5,
  },
  workoutText: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Stomic',
    textTransform: 'uppercase',
    marginTop: 0,
    marginLeft: 6,
  },

  // Tab Styles
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#AFAFAF',
    borderRadius: 6,
    width: 160,
    height: 24,
    marginTop: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTab: {
    backgroundColor: '#00E5FF'
  },
  leftRounded: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  middleTab: {
    borderRadius: 0
  },
  rightRounded: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  },
  tabText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'center',
  },
  selectedTabText: {
    color: '#000',
  },

  // Data Section
  dataWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    marginTop: 12,
    marginLeft: 5,
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dataText: {
    fontSize: 39,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Inter',
    marginTop: 10
  },
  unitText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Inter',
    fontWeight: '300',
    alignSelf: 'center',
    marginRight: 5,
    marginTop: 9
  },
});

export default WorkoutCard;