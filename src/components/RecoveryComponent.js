import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '@rneui/themed';

const RecoveryComponent = ({ initialTab = 'today', minutes = 0 }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedTab, setSelectedTab] = useState('Today');

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RECOVERY</Text>
         {/* <View style={[styles.tabs,{
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
              </View> */}
        {/* <View style={styles.tabContainer}>
          <Button
            title="TODAY"
            buttonStyle={[
              styles.tabButton,
              activeTab === 'today' && styles.activeTabButton,
            ]}
            titleStyle={styles.tabText}
            onPress={() => handleTabPress('today')}
          />
          <Button
            title="WEEK"
            buttonStyle={[
              styles.tabButton,
              activeTab === 'week' && styles.activeTabButton,
            ]}
            titleStyle={styles.tabText}
            onPress={() => handleTabPress('week')}
          />
          <Button
            title="MONTH"
            buttonStyle={[
              styles.tabButton,
              activeTab === 'month' && styles.activeTabButton,
            ]}
            titleStyle={styles.tabText}
            onPress={() => handleTabPress('month')}
          />
        </View> */}
      </View>
      <View style={styles.content}>
        <Image
          source={{ uri: 'https://dashboard.codeparrot.ai/api/image/Z8rXaqwi-41-yYB7/recovery.png' }}
          style={styles.icon}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{minutes}</Text>
          <Text style={styles.timeUnit}>min</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#000000',
    padding: 20,
    alignSelf:'center'
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontFamily: 'Stomic',
    fontSize: 28,
    lineHeight: 28,
    color: '#000000',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  tabButton: {
    backgroundColor: '#B0B0B0',
    paddingVertical: 3.5,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  activeTabButton: {
    backgroundColor: '#00E5FF',
  },
  tabText: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: 40,
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  timeText: {
    fontFamily: 'Inter',
    fontSize: 36,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 54,
  },
  timeUnit: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '300',
    color: '#111827',
    lineHeight: 22.5,
    marginLeft: 2,
    marginBottom: 8,
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

export default RecoveryComponent;

