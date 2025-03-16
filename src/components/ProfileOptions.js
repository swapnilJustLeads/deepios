import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { useUserDetailsContext } from '../context/UserDetailsContext';
import { useAuth } from '../firebase/hooks/auth';
import Toast from 'react-native-toast-message';
import HeaderComponent from '../components/HeaderComponent';
import ThemeToggle from '../components/ThemeToggle';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const { userDetails, updateUserDetails } = useUserDetailsContext();
  const { logout } = useAuth();
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
        renderItem={({ item }) => (
          <Button
            title={item.title}
            onPress={() => !item.disabled && (setCurrTab(item.key), setModalVisible(true))}
            buttonStyle={[styles.optionButton, item.disabled && styles.disabledButton]}
            titleStyle={[styles.optionText, item.disabled && styles.disabledText]}
            disabled={item.disabled}
          />
        )}
      />

      {/* ✅ Modal (Popup) */}
      <Modal animationType="fade" transparent visible={modalVisible}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text h4 style={styles.modalTitle}>
              {currTab === 'changeName' ? 'CHANGE NAME' : 'UPDATE INFO'}
            </Text>
            {currTab === 'changeName' && (
              <>
                <Input placeholder="First Name" value={firstName} onChangeText={setFirstName} />
                <Input placeholder="Last Name" value={lastName} onChangeText={setLastName} />
              </>
            )}
            <Button title="SAVE" onPress={handleUpdateUser} buttonStyle={styles.saveButton} />
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
    paddingVertical: 12,
    borderRadius: 10,
  },
  optionText: { fontSize: 14, fontWeight: 'bold', color: '#000' },
  disabledButton: { backgroundColor: '#E5E5E5' },
  disabledText: { color: '#A5A5A5' },

  // ✅ Modal (Popup)
  modalOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center',
  },
  modalTitle: { fontWeight: 'bold', marginBottom: 10 },
  saveButton: { backgroundColor: '#000', width: '100%', marginTop: 10 },

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
