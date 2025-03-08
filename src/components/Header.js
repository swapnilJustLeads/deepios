import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const Header = ({ style }) => {
  return (
    <View style={[styles.headerContainer, style]}>
      <TouchableOpacity>
        <Image 
          source={{ uri: 'https://dashboard.codeparrot.ai/api/image/Z8q_h7wkNXOiaWFi/link-→-p.png' }} 
          style={styles.icon} 
        />
      </TouchableOpacity>
      
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>Mon, 24 Feb</Text>
      </View>
      
      <TouchableOpacity>
        <Image 
          source={{ uri: 'https://dashboard.codeparrot.ai/api/image/Z8q_h7wkNXOiaWFi/link-→-s-2.png' }} 
          style={styles.icon} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    minWidth: 342,
    height: 96,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#000',
  },
  icon: {
    width: 30,
    height: 30,
  },
  dateContainer: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: '800',
    lineHeig   textAlign: 'center',
  },
});

export default SupplementCard;

