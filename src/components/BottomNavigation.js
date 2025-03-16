import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Icon } from '@rneui/themed';

const BottomNavigation = () => {
  const navItems = [
    { id: 1, label: 'Workout', icon: 'https://dashboard.codeparrot.ai/api/image/Z8rUiLwkNXOiaWF2/svg.png' },
    { id: 2, label: 'Recovery', icon: 'https://dashboard.codeparrot.ai/api/image/Z8rUiLwkNXOiaWF2/svg-2.png', isActive: true },
    { id: 3, label: '', icon: 'https://dashboard.codeparrot.ai/api/image/Z8rUiLwkNXOiaWF2/link-→-s.png', isCenter: true },
    { id: 4, label: 'Cardio', icon: 'https://dashboard.codeparrot.ai/api/image/Z8rUiLwkNXOiaWF2/svg-3.png' },
    { id: 5, label: 'Supplement', icon: 'https://dashboard.codeparrot.ai/api/image/Z8rUiLwkNXOiaWF2/svg-4.png' },
  ];

  return (
    <View style={styles.container}>
      <Button
        title="NEW RECOVERY"
        buttonStyle={styles.newRecoveryButton}
        titleStyle={styles.newRecoveryText}
      />
      
      <View style={styles.navigationBar}>
        {navItems.map((item) => (
          <View
            key={item.id}
            style={[styles.navItem, item.isCenter && styles.centerItem]}
          >
            <Icon
              name="image"
              type="material"
              source={{ uri: item.icon }}
              containerStyle={item.isCenter ? styles.centerIcon : styles.icon}
            />
            {!item.isCenter && (
              <Text style={[styles.label, item.isActive && styles.activeLabel]}>
                {item.label}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 390,
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingVertical: 10,
  },
  newRecoveryButton: {
    width: 100,
    height: 23,
    backgroundColor: '#00E5FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  newRecoveryText: {
    fontFamily: 'Inter',
    fontSize: 8,
    fontWeight: '900',
    color: '#000000',
    textTransform: 'uppercase',
  },
  navigationBar: {
    width: '100%',
    height: 73,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  navItem: {
    width: 71.6,
    height: 60,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerItem: {
    width: 41,
    height: 41,
  },
  icon: {
    width: 22,
    height: 25,
    resizeMode: 'contain',
  },
  centerIcon: {
    width: 41,
    height: 41,
  },
  label: {
    fontFamily: 'Stomic',
    fontSize: 16,
    color: '#000000',
    textTransform: 'uppercase',
    marginTop: 4,
    lineHeight: 24,
  },
  activeLabel: {
    color: '#00E5FF',
  },
});

export default BottomNavigation;

