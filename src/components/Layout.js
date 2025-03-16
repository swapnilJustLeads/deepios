import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from './Header';
import SupplementCard from './SupplementCard';

const Layout = () => {
  return (
    <View style={styles.container}>
      <Header style={styles.header} />
      <View style={styles.cardsContainer}>
        <SupplementCard time="02:30 PM" title="Pre-Workout" />
        <SupplementCard time="12:30 PM" title="Post-Workout" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 16,
  },
  header: {
    width: '100%',
    height: 96,
  },
  cardsContainer: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});

export default Layout;

