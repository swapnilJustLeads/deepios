import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SupplementCard = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Pre-Workout</Text>
      <Text style={styles.heading}>ESN</Text>
      <View style={styles.itemRow}>
        <View style={{width: '40%'}}>
          <Text style={styles.item}>Whey Protein Isolate</Text>
        </View>

        <View style={{width: '30%', alignItems:'center'}}>
          <Text style={styles.amount}>50mg</Text>
        </View>
        <View style={{width: '30%'}}>
          <Text style={styles.total}></Text>
        </View>

        <View />
      </View>
      <View style={styles.itemRow}>
      <View style={{width: '40%'}}>
        <Text style={styles.item}>Creatine Monohydrate</Text>
        </View>
        <View style={{width: '30%', alignItems:'center'}}>
          <Text style={styles.amount}>5g</Text>
        </View>
        <View style={{width: '30%'}}>
          <Text style={styles.total}></Text>
        </View>
      </View>
      <Text style={styles.heading}>Bio</Text>
      <View style={styles.itemRow}>
      <View style={{width: '40%'}}>
        <Text style={styles.item}>Flohsamen</Text>
        </View>
        <View style={{width: '30%',alignItems:'center'}}>
          <Text style={styles.amount}>25g</Text>
        </View>
        <View style={{width: '30%'}}>
          <Text style={styles.total}></Text>
        </View>
      </View>
      <View style={styles.itemRow}>
      <View style={{width: '40%'}}>
        <Text style={styles.item}>Leinsamen (Normal)</Text>
        </View>
        <View style={{width: '30%',alignItems:'center'}}>
          <Text style={styles.amount}>25g</Text>
        </View>
        <View style={{width: '30%'}}>
          <Text style={styles.total}></Text>
        </View>
      </View>
      <View style={[styles.itemRow, styles.lastItemRow]}>
      <View style={{width: '40%'}}>
        <Text style={styles.item}>Microbiom Mandelmilch</Text>
        </View>
        <View style={{width: '30%',alignItems:'center'}}>
          <Text style={styles.amount}>5g</Text>
        </View>
        <View style={{width: '30%'}}>
          <Text style={styles.total}>350 ml</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    borderColor: '#e5e7eb',
    // paddingVertical: 8,
  },
  heading: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
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
    // textAlign: 'right',
  },
  total: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    textAlign: 'right',
    marginTop: 8,
  },
});

export default SupplementCard;