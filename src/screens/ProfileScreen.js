import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Modal, TouchableOpacity,Dimensions } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { useUserDetailsContext } from '../context/UserDetailsContext';
import { useAuth } from '../firebase/hooks/auth';
import Toast from 'react-native-toast-message';
import HeaderComponent from '../components/HeaderComponent';
import ThemeToggle from '../components/ThemeToggle';
import { ProfileForm, PasswordForm } from '../components/ProfileForm';
  // Calculate button dimensions
  const screenWidth = Dimensions.get('window').width;
  const buttonWidth = (screenWidth - 48) / 2; // 48 = padding (16) * 2 + space between buttons (16)
const ProfileScreen = () => {
  const { t } = useTranslation();
  const { userDetails, updateUserDetails } = useUserDetailsContext();
  const { logout } = useAuth();
  const [loading,setloading] = useState(false)
  const [currTab, setCurrTab] = useState('');
  const [language, setLanguage] = useState('en');
  const [modalVisible, setModalVisible] = useState(false);
  const [firstName, setFirstName] = useState(userDetails?.firstName || '');
  const [lastName, setLastName] = useState(userDetails?.lastName || '');

  useEffect(() => {
    if (userDetails) {
      setLanguage(userDetails?.language || 'en');
    }
  }, [userDetails]);

  const handleUpdateUser = async () => {
    try {
      await updateUserDetails({ firstName, lastName });
      Toast.show({ type: 'success', text1: t('toastMessages.userDetailsUpdatedSuccess') });
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating user:', error);
      Toast.show({ type: 'error', text1: t('toastMessages.failedToUpdateUserDetails') });
    }
  };

  const options = [
    { title: 'CHANGE NAME', key: 'changeName' },
    { title: 'CHANGE PASSWORD', key: 'changePassword' },
    { title: 'CHANGE PROFILE PICTURE', key: 'changeProfilePicture' },
    { title: 'CHANGE EMAIL', key: 'changeEmail', disabled: true },
    { title: 'BODY WEIGHT', key: 'bodyWeight' },
  ];
  const renderOptionButton = ({ item }) => {
    if (item.isEmpty) {
      return <View style={{ width: buttonWidth, height: 56, margin: 8 }} />;
    }
    const isSelected = currTab === item.key;
    return (
      <Button
        title={item.title}
        titleStyle={[
          styles.optionText, 
          item.disabled && styles.disabledText,
          isSelected && { color: '#000' } // Change text color to white when selected
        ]}
        buttonStyle={[
          styles.optionButton, 
          item.disabled && styles.disabledButton,
          isSelected && { backgroundColor: '#00E5FF' }, // Apply #00E5FF color when selected
          { 
            width: buttonWidth,
            height: 24,
            borderRadius: 8,
            paddingTop: 6,
            paddingBottom: 6,
          }
        ]}
        onPress={() => {
          if (!item.disabled) {
            // Set the tab first, then open the modal
            setCurrTab(item.key);
            setModalVisible(true);
          }
        }}
        disabled={item.disabled}
        disabledStyle={styles.disabledButton}
        disabledTitleStyle={styles.disabledText}
      />
    );
  };
  return (
    <View style={styles.container}>
      {/* ✅ Header */}
      <HeaderComponent />

      {/* ✅ FlatList Grid Layout */}
      <FlatList
        data={options}
        numColumns={2}
        keyExtractor={(item) => item.key}
        columnWrapperStyle={styles.row}
        renderItem={renderOptionButton}
      />

      {/* ✅ Modal (Popup) */}
{/* ✅ Modal (Popup) */}
<Modal animationType="fade" transparent visible={modalVisible}>
  <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
    <View style={styles.modalContainer}>
      <Text h4 style={styles.modalTitle}>
        {currTab === 'changeName' ? 'CHANGE NAME' : 
         currTab === 'changePassword' ? 'CHANGE PASSWORD' : 
         currTab === 'changeProfilePicture' ? 'CHANGE PROFILE PICTURE' :
         currTab === 'bodyWeight' ? 'BODY WEIGHT' : 'UPDATE INFO'}
      </Text>
      
      {currTab === 'changeName' && (
        <>
        <ProfileForm user={userDetails} updateUser={handleUpdateUser} isSaving={loading} />
        </>
      )}
      
      {currTab === 'changePassword' && (
        <>
          <Input placeholder="Current Password" secureTextEntry />
          <Input placeholder="New Password" secureTextEntry />
          <Input placeholder="Confirm New Password" secureTextEntry />
        </>
      )}
      
      {currTab === 'changeProfilePicture' && (
        <>
          {/* Add profile picture selection UI */}
          <Text>Profile picture selection coming soon</Text>
        </>
      )}
      
      {currTab === 'bodyWeight' && (
        <>
          <Input placeholder="Enter your weight" keyboardType="numeric" />
          <Text>Select your weight unit</Text>
          {/* Add weight unit selection */}
        </>
      )}
      
      <Button 
        title="SAVE" 
        onPress={handleUpdateUser} 
        buttonStyle={styles.saveButton} 
      />
    </View>
  </TouchableOpacity>
</Modal>

      {/* ✅ Bottom Section (Theme Toggle + Logout) */}
      <View style={styles.bottomSection}>
        <View style={styles.languageSelector}>
          <Button
            title="English"
            onPress={() => setLanguage('en')}
            buttonStyle={[styles.languageButton, language === 'en' && styles.activeLanguageButton]}
          />
          <Button
            title="Deutsch"
            onPress={() => setLanguage('de')}
            buttonStyle={[styles.languageButton, language === 'de' && styles.activeLanguageButton]}
          />
        </View>
        <View style={styles.actions}>
          <ThemeToggle />
          <Button title="Logout" onPress={logout} buttonStyle={styles.logoutButton} />
        </View>
      </View>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D3D3D3', alignItems: 'center' },
  row: { justifyContent: 'space-between', marginBottom: 10 },

  // ✅ Grid Buttons
  optionButton: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
     borderRadius: 10,

  },
  optionText: { fontSize: 10, fontWeight: 'bold', color: '#000' },
  disabledButton: { backgroundColor: '#E5E5E5' },
  disabledText: { color: '#A5A5A5' },

  // ✅ Modal (Popup)
  modalOverlay: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 212,
    height: 201,
    borderRadius: 17,
    borderWidth: 1,
    
  },
  modalTitle: { 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  saveButton: { 
    backgroundColor: '#000', 
    width: '100%', 
    marginTop: 10 
  },

  // ✅ Bottom Section
  bottomSection: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF',
    padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  languageSelector: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 4 },
  languageButton: { paddingHorizontal: 12, borderRadius: 5, backgroundColor: '#E5E5E5' },
  activeLanguageButton: { backgroundColor: '#00E5FF' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  logoutButton: { backgroundColor: '#00E5FF', paddingHorizontal: 12, borderRadius: 5 },
});

export default ProfileScreen;
