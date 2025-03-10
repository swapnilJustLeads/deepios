import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MainContainer_Header_ExerciseItem from './MainContainer_Header_ExerciseItem';
import { useUserSupplementContext } from '../context/UserContexts';
import { useDetails } from '../context/DeatailsContext';
import moment from 'moment';

const SupplementLayout = (props) => {
  const { supplementData } = useUserSupplementContext();
  const { subCategories } = useDetails();
  
  // Filter data for the selected date
  const selectedDate = props.selectedDate || moment().format('YYYY-MM-DD');
  
  const filteredData = supplementData.filter(item => {
    if (item.createdAt) {
      const itemDate = moment(new Date(item.createdAt.seconds * 1000)).format('YYYY-MM-DD');
      return itemDate === selectedDate;
    }
    return false;
  });
  
  // Helper function to get supplement name from subCategory ID
  function getSupplementName(subCategoryId, supplementName) {
    if (supplementName) return supplementName;
    if (!subCategoryId || !subCategories) return 'Unknown Supplement';
    
    const subCategory = subCategories.find(sc => sc.id === subCategoryId);
    return subCategory ? subCategory.name : 'Unknown Supplement';
  }
  
  // Transform data into format expected by MainContainer_Header_ExerciseItem
  const transformData = () => {
    const transformedData = [];
    
    filteredData.forEach(item => {
      if (!item.data || !Array.isArray(item.data)) return;
      
      item.data.forEach(supplement => {
        const supplementName = getSupplementName(supplement.subCategory, supplement.name);
        
        // For supplements, show dosage and timing
        const dosageInfo = supplement.amount ? `${supplement.amount}` : '';
        const liquidInfo = supplement.liquid ? `${supplement.liquid}ml` : '';
        const timingInfo = supplement.timing ? ` (${supplement.timing.replace('_', ' ')})` : '';
        
        const displayInfo = [dosageInfo, liquidInfo]
          .filter(info => info) // Remove empty strings
          .join(' × ');
        
        const setsArray = [
          {
            number: '1',
            weight: displayInfo + timingInfo
          }
        ];
        
        transformedData.push({
          name: supplementName,
          sets: setsArray
        });
      });
    });
    
    return transformedData;
  };
  
  const supplementItems = transformData();

  return (
    <View style={styles.container}>
      {supplementItems.length > 0 ? (
        <MainContainer_Header_ExerciseItem 
          title={props.title || "Supplement"} 
          exercises={supplementItems} 
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No supplements found for today</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noDataText: {
    fontSize: 16,
    color: '#555',
  }
});

export default SupplementLayout;