import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import SupplementCard from './SupplementCard';

const SupplementLayoutComponent = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SUPPLEMENT</Text>
        <Text style={styles.time}>02:30 PM</Text>
        <View style={styles.icons}>
          <Image source={{ uri: 'https://dashboard.codeparrot.ai/api/image/Z8rAtqwi-41-yYBp/copy-lig.png' }} style={styles.icon} />
          <Image source={{ uri: 'https://dashboard.codeparrot.ai/api/image/Z8rAtqwi-41-yYBp/deldark.png' }} style={styles.icon} />
        </View>
      </View>
      <SupplementCard />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 342,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    padding: 16,
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
});

export default SupplementLayoutComponent;

