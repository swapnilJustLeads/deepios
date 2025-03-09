import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import { useUserSupplementContext } from '../context/UserContexts';
import { useDetails } from '../context/DeatailsContext';
import moment from 'moment';

const SupplementCard = ({ selectedDate }) => {
  const { supplementData } = useUserSupplementContext();
  const { subCategories } = useDetails();
  
  // Default to today if no selectedDate provided
  const currentDate = selectedDate || moment().format('YYYY-MM-DD');
  
  // Filter supplements for the selected date
  const filteredSupplements = supplementData.filter(supplement => {
    if (supplement.createdAt) {
      const supplementTimestamp = supplement.createdAt.seconds * 1000;
      const supplementDate = moment(supplementTimestamp).format('YYYY-MM-DD');
      return supplementDate === currentDate;
    }
    return false;
  });
  
  // Group supplements by timing (pre-workout, post-workout, etc.)
  const groupedSupplements = {};
  
  filteredSupplements.forEach(supplement => {
    if (supplement.data && Array.isArray(supplement.data)) {
      supplement.data.forEach(item => {
        const timing = item.timing || 'Other';
        
        if (!groupedSupplements[timing]) {
          groupedSupplements[timing] = [];
        }
        
        // Get supplement name from subCategories
        const supplementName = getSupplementName(item.subCategory);
        
        groupedSupplements[timing].push({
          name: supplementName,
          amount: item.amount || '',
          company: item.company || '',
          liquid: item.liquid || '',
          notes: item.notes || '',
          subCategory: item.subCategory,
          category: item.category,
        });
      });
    }
  });
  
  // Helper function to get supplement name from subCategory ID
  function getSupplementName(subCategoryId) {
    if (!subCategoryId || !subCategories) return 'Unknown Supplement';
    
    const subCategory = subCategories.find(sc => sc.id === subCategoryId);
    return subCategory ? subCategory.name : 'Unknown Supplement';
  }
  
  // Group supplements by company within each timing
  function organizeByCompany(supplements) {
    const byCompany = {};
    
    supplements.forEach(supp => {
      const company = supp.company || 'Other';
      if (!byCompany[company]) {
        byCompany[company] = [];
      }
      byCompany[company].push(supp);
    });
    
    return byCompany;
  }
  
  // Check if there are any supplements to display
  const hasSupplements = Object.keys(groupedSupplements).length > 0;
  
  if (!hasSupplements) {
    return (
      <View style={styles.card}>
        <Text style={styles.noDataText}>No supplements recorded for today</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {Object.keys(groupedSupplements).map((timing, timingIndex) => {
          // Organize supplements by company for this timing
          const byCompany = organizeByCompany(groupedSupplements[timing]);
          
          return (
            <View key={`timing-${timingIndex}`}>
              {/* Timing heading */}
              <Text style={styles.heading}>
                {timing.charAt(0).toUpperCase() + timing.slice(1)}
              </Text>
              
              {/* Loop through each company */}
              {Object.keys(byCompany).map((company, companyIndex) => (
                <View key={`company-${companyIndex}`}>
                  {/* Company heading */}
                  <Text style={styles.heading}>{company}</Text>
                  
                  {/* Loop through supplements for this company */}
                  {byCompany[company].map((supplement, supplementIndex) => {
                    const isLast = supplementIndex === byCompany[company].length - 1;
                    
                    return (
                      <View 
                        key={`supplement-${supplementIndex}`} 
                        style={[
                          styles.itemRow, 
                          isLast && companyIndex === Object.keys(byCompany).length - 1 ? styles.lastItemRow : {}
                        ]}
                      >
                        <View style={{width: '40%'}}>
                          <Text style={styles.item}>{supplement.name}</Text>
                        </View>
                        <View style={{width: '30%', alignItems: 'center'}}>
                          <Text style={styles.amount}>{supplement.amount}</Text>
                        </View>
                        <View style={{width: '30%'}}>
                          <Text style={styles.total}>
                            {supplement.liquid ? `${supplement.liquid} ml` : ''}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  card: {
    flexGrow: 1,
    borderColor: '#e5e7eb',
    padding: 10,
  },
  heading: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
    marginTop: 8,
  },
  subheading: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 4,
  },
  lastItemRow: {
    borderBottomWidth: 0, // Remove border for the last item
  },
  item: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    width: 150,
  },
  amount: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
  },
  total: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    textAlign: 'right',
  },
  noDataText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SupplementCard;