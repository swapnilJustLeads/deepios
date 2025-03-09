import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SupplementCard from './SupplementCard';
import Copy from '../assets/images/copy.svg';
import Edit from '../assets/images/edit.svg';
import Delete from '../assets/images/delete.svg';
import moment from 'moment';

// ✅ Import the supplement context
import { useUserSupplementContext } from '../context/UserContexts/SupplementContext';

const SupplementLayout = () => {
  const { supplementData } = useUserSupplementContext(); // ✅ Fetch data from context
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  console.log("🔥 Supplement Data from Context:", supplementData); // Debugging

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SUPPLEMENT</Text>
        <Text style={styles.time}>02:30 PM</Text>
        <View style={styles.icons}>
          <Edit style={styles.icon} />
          <Copy style={styles.icon} />
          <Delete style={styles.icon} />
        </View>
      </View>

      {/* ✅ Pass supplementData to SupplementCard */}
      {supplementData.length > 0 ? (
        <SupplementCard selectedDate={selectedDate} supplementData={supplementData} />
      ) : (
        <Text style={styles.noData}>No supplements available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '91%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    padding: 16,
    alignSelf: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Stomic',
    fontSize: 18,
    fontWeight: '400',
    textTransform: 'uppercase',
    lineHeight: 27,
  },
  time: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  icons: {
    flexDirection: 'row',
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },
  noData: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#666',
  },
});

export default SupplementLayout;
