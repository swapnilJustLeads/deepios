import React from 'react';
import {View, Text, StyleSheet, ScrollView, FlatList} from 'react-native';
import {useUserSupplementContext} from '../context/UserContexts';
import {useDetails} from '../context/DeatailsContext';
import moment from 'moment';
import Copy from '../assets/images/copy.svg';
import Edit from '../assets/images/edit.svg';
import Delete from '../assets/images/delete.svg';
const SupplementCard = props => {
  const {supplementData} = useUserSupplementContext();
  const {subCategories} = useDetails();
  function getSupplementName(subCategoryId, supplementName) {
    if (supplementName) return supplementName;
    if (!subCategoryId || !subCategories) return 'Unknown Supplement';

    const subCategory = subCategories.find(sc => sc.id === subCategoryId);
    return subCategory ? subCategory.name : 'Unknown Supplement';
  }
  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={props.data.data}
        renderItem={({item, index}) => {
          const supplementName = getSupplementName(item.subCategory, item.name);
          const isLastItem = index === props.data.data.length - 1;

          return (
            <View>
              <View style={styles.card}>
                <Text style={styles.heading}>{item.timing}</Text>
                <Text style={styles.subheading}>{item.company} </Text>
                <View
                  style={[
                    styles.itemRow,
                    isLastItem ? styles.lastItemRow : styles.withBottomBorder,
                  ]}>
                  <Text style={styles.item}>{supplementName} </Text>
                  <Text style={styles.amount}>{item.amount} </Text>
                  <Text style={styles.total}>{item.liquid}</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
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
    paddingLeft:16,
    paddingRight:16,
    paddingBottom:3
    // padding: 10,
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
    width: '100%',
    paddingBottom:6
  },
  withBottomBorder: {
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  lastItemRow: {
    borderBottomWidth: 0, // No border for the last item
  },
  item: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    // flex: 1,  // Give this 3 parts of the available space
    textAlign: 'left',
    // backgroundColor: 'red',
    width: '50%',
  },
  amount: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    width: '20%',
  },
  total: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    textAlign: 'right',
    width: '30%',
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
