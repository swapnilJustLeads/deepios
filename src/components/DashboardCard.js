import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card } from '@rneui/themed';

const DashboardCard = ({ icon, title, values = {}, unit }) => {
  const [selectedRange, setSelectedRange] = useState('Today');

  // Safe access with default value
  const currentValue = values?.[selectedRange] ?? 0;

  return (
    <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>

        {/* Time Range Buttons */}
        <View style={styles.rangeButtons}>
          {['Today', 'Week', 'Month'].map((range) => (
            <TouchableOpacity
              key={range}
              style={[styles.rangeButton, selectedRange === range && styles.activeRange]}
              onPress={() => setSelectedRange(range)}
            >
              <Text style={[styles.rangeText, selectedRange === range && styles.activeRangeText]}>
                {range.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Icon & Value */}
      <View style={styles.cardContent}>
        <Text style={styles.iconPlaceholder}>{icon}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{currentValue}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
    width: '90%',
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  rangeButtons: {
    flexDirection: 'row',
  },
  rangeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#AFAFAF',
    marginHorizontal: 2,
    borderRadius: 5,
  },
  activeRange: {
    backgroundColor: '#00E5FF',
  },
  rangeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  activeRangeText: {
    color: '#000',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  iconPlaceholder: {
    fontSize: 18,
    color: '#666',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 15,
    fontWeight: '300',
    color: '#333',
    marginLeft: 5,
  },
});

export default DashboardCard;
