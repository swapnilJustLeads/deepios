import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Card} from '@rneui/themed';

const WorkoutCard = props => {
  const [selectedTab, setSelectedTab] = useState('Today');

  return (
    <Card containerStyle={styles.card}>
      <View style={styles.header}>
        <Text style={styles.workoutText}>{props?.name}</Text>
        <View
          style={[
            styles.tabs,
            {
              width: 210,
              height:21,
              marginTop:3
            },
          ]}>
          {['Today', 'Week', 'Month'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.selectedTab]}
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
         
        }}>
          <View style={{marginTop:-2}} >
              {props.image}
          </View>
      

        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>3605</Text>
          <Text style={styles.unitText}>kg</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop:20,
    borderRadius: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderColor: 'black',
    paddingBottom:4
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor:'green',
    marginBottom: -5,
    marginTop: -5,
  },
  workoutText: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Stomic',
    textTransform: 'uppercase',
    marginTop: -15,
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ddd',
    borderRadius: 12,
    // padding: 5,
    marginBottom: 15,
    
  },
  tab: {
    flex: 1,
    // paddingVertical: 8,
    alignItems: 'center',
    borderEndEndRadius: 9,
    justifyContent:'center'
  },
  selectedTab: {
    backgroundColor: '#00E5FF',
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
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  dataText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Inter',
  },
  unitText: {
    fontSize: 15,
    color: '#000',
    // marginLeft: 5,
    fontFamily:'Inter',
    fontWeight:'300',
    alignSelf:'center'
  },
});

export default WorkoutCard;
