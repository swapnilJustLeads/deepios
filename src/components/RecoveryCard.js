import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '@rneui/themed';
import Bardumble from '../assets/images/bardumble.svg';



const RecoveryCard = (props) => {
  const [selectedTab, setSelectedTab] = useState('Today');

  return (
    <Card containerStyle={styles.card}>
      <View style={styles.header}>
        <Text style={styles.workoutText}>{props?.name}</Text>
        <View style={[styles.tabs,{
            width:210
        }]}>
        {['Today', 'Week', 'Month'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && styles.selectedTab,
              
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.selectedTabText
              ]}
            >
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      </View>
      <View style={{flexDirection:'row', justifyContent:'space-between'}} >
        {props.image}
    

      
<View style={styles.dataContainer}>
  <Text style={styles.dataText}>0</Text>
  <Text style={styles.unitText}>min</Text>
</View>
      </View>
      
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderColor:'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  workoutText: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Stomic',
    textTransform: 'uppercase'
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#000',
    borderRadius: 5
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ddd',
    borderRadius: 12,
    // padding: 5,
    marginBottom: 15
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderEndEndRadius:9
  
  },
  selectedTab: {
    backgroundColor: '#00E5FF'
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000'
  },
  selectedTabText: {
    color: '#000'
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center'
  },
  dataText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000'
  },
  unitText: {
    fontSize: 20,
    color: '#000',
    marginLeft: 5
  }
});

export default RecoveryCard;
