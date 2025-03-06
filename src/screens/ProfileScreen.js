import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { useUserDetailsContext } from '../context/UserDetailsContext';
import { useAuth } from '../firebase/hooks/auth';
import Toast from 'react-native-toast-message';
import HeaderComponent from '../components/HeaderComponent';
import { ProfileForm } from '../components/ProfileForm';

const screenWidth = Dimensions.get('window').width;
const buttonWidth = (screenWidth - 48) / 2;

const ProfileScreen = () => {
  const { t } = useTranslation();
  const { userDetails, updateUserDetails } = useUserDetailsContext();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currTab, setCurrTab] = useState(''); // This will determine which form to show

  const handleUpdateUser = async () => {
    try {
      await updateUserDetails({ firstName, lastName });
      Toast.show({ type: 'success', text1: t('toastMessages.userDetailsUpdatedSuccess') });
      setCurrTab(''); // Hide the form after updating
    } catch (error) {
      console.error('Error updating user:', error);
      Toast.show({ type: 'error', text1: t('toastMessages.failedToUpdateUserDetails') });
    }
  };

  const options = [
    { title: 'CHANGE NAME', key: 'changeName' },
    { title: 'CHANGE PASSWORD', key: 'changePassword' },
    { title: 'CHANGE PROFILE PICTURE', key: 'changeProfilePicture' },
    { title: 'BODY WEIGHT', key: 'bodyWeight' },
  ];

  const renderOptionButton = ({ item }) => (
    <Button
      title={item.title}
      titleStyle={[
        styles.optionText,
        currTab === item.key && { color: '#000' },
      ]}
      buttonStyle={[
        styles.optionButton,
        currTab === item.key && { backgroundColor: '#00E5FF' },
        { width: buttonWidth,
          height: 24,
          borderRadius: 8,
          paddingTop: 6,
          paddingBottom: 6, },
      ]}
     
      onPress={() => {
        setCurrTab(item.key === currTab ? '' : item.key); // Toggle the form display
      }}
    />
  );

  return (
    <View style={styles.container}>
      {/* ✅ Header */}
      <HeaderComponent />

      {/* ✅ Grid Layout for Buttons */}
      <FlatList
        data={options}
        numColumns={2}
        keyExtractor={(item) => item.key}
        columnWrapperStyle={styles.row}
        renderItem={renderOptionButton}
      />

      {/* ✅ Centered Form View (Only Visible When Button Clicked) */}
      {currTab !== '' && (
        <View style={styles.centeredFormContainer}>
          <Text h4 style={styles.formTitle}>
            {currTab === 'changeName' ? 'CHANGE NAME' : 
             currTab === 'changePassword' ? 'CHANGE PASSWORD' : 
             currTab === 'changeProfilePicture' ? 'CHANGE PROFILE PICTURE' :
             currTab === 'bodyWeight' ? 'BODY WEIGHT' : 'UPDATE INFO'}
          </Text>

          {/* Conditionally Render Forms */}
          {currTab === 'changeName' && (
            <ProfileForm user={userDetails} updateUser={handleUpdateUser} isSaving={loading} />
          )}

          {currTab === 'changePassword' && (
            <>
              <Input placeholder="Current Password" secureTextEntry />
              <Input placeholder="New Password" secureTextEntry />
              <Input placeholder="Confirm New Password" secureTextEntry />
            </>
          )}

          {currTab === 'changeProfilePicture' && (
            <Text>Profile picture selection coming soon</Text>
          )}

          {currTab === 'bodyWeight' && (
            <>
              <Input placeholder="Enter your weight" keyboardType="numeric" />
              <Text>Select your weight unit</Text>
            </>
          )}

          {/* Save Button */}
          <Button title="SAVE" onPress={handleUpdateUser} buttonStyle={styles.saveButton} />
        </View>
      )}

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D3D3D3', alignItems: 'center', paddingTop: 20 },
  row: { justifyContent: 'space-between', marginBottom: 10 },

  // ✅ Grid Buttons
  optionButton: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  optionText: { fontSize: 12, fontWeight: 'bold', color: '#000' },

  // ✅ Centered Form (Replaces Modal)
  centeredFormContainer: {
    position: 'absolute',
    top: '40%', // Center on screen
    left: '10%',
    right: '10%',
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },

  formTitle: { fontWeight: 'bold', marginBottom: 10 },

  // ✅ Save Button
  saveButton: {
    backgroundColor: '#000',
    width: '100%',
    marginTop: 10,
  },
});

export default ProfileScreen;
