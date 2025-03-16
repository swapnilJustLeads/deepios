import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Button, Input, Text } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { useUserDetailsContext } from '../context/UserDetailsContext';
import { useAuth } from '../firebase/hooks/auth';
import Toast from 'react-native-toast-message';
import ImagePicker from 'react-native-image-crop-picker';
import HeaderComponent from '../components/HeaderComponent';
import { uploadProfilePicture } from '../firebase/firebase_client';
import { EmailChangeComponent, PasswordForm, ProfileForm, ProfilePicChange } from '../components/ProfileForm';
import LanguageThemeLogout from '../components/LangaugeThemeButton';
import { useTheme } from '../hooks/useTheme';

const screenWidth = Dimensions.get('window').width;
const buttonWidth = (screenWidth - 48) / 2;

const ProfileScreen = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const { userDetails, updateUserDetails } = useUserDetailsContext();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [currTab, setCurrTab] = useState('');
  

  useEffect(() => {
    console.log('🔍 Current userDetails from context:', userDetails);

    if (userDetails) {
      setFirstName(userDetails.firstName || '');
      setLastName(userDetails.lastName || '');
      setProfileImage(userDetails.profilePicture || '');
    }
  }, [userDetails]);

  const handleUpdateUser = async () => {
    try {
      await updateUserDetails({ firstName, lastName });
      console.log('✅ User details updated successfully:', { firstName, lastName });

      Toast.show({ type: 'success', text1: t('toastMessages.userDetailsUpdatedSuccess') });
      setCurrTab('');
    } catch (error) {
      console.error('❌ Error updating user:', error);
      Toast.show({ type: 'error', text1: t('toastMessages.failedToUpdateUserDetails') });
    }
  };

  const handleEditPress = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        compressImageQuality: 0.8,
      });
  
      // Debug log the image object to see its structure
      console.log('Image picker result:', image);
      console.log('Image path:', image.path);
  
      setLoading(true);
      
      // Make sure we're passing the correct parameters in the correct order
      const uploadedUrl = await uploadProfilePicture(userDetails.username, image.path);
      
      await updateUserDetails({ profilePicture: uploadedUrl });
  
      setLoading(false);
      console.log('✅ Profile picture updated successfully!');
    } catch (error) {
      console.error('❌ Error updating profile picture:', error);
      setLoading(false);
    }
  };
  
  const options = [
    { title: t('changeName'), key: 'changeName' },
    { title: t('changePassword'), key: 'changePassword' },
    { title: t('changeProfilePicture'), key: 'changeProfilePicture' },
    { title: t('changeEmail'), key: 'emailchange' },
  ];

  const renderOptionButton = ({ item }) => (
    <Button
      title={
        <Text style={[
          styles.optionText,
          currTab === item.key && styles.activeOptionText
        ]}>
          {item.title}
        </Text>
      }
      buttonStyle={[
        styles.optionButton,
        currTab === item.key && styles.activeOptionButton
      ]}
      onPress={() => {
        setCurrTab(item.key === currTab ? '' : item.key);
      }}
    />
  );
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#D3D3D3' }]}>
      <HeaderComponent />

      <FlatList
        data={options}
        numColumns={2}
        keyExtractor={(item) => item.key}
        columnWrapperStyle={styles.row}
        renderItem={renderOptionButton}
      />
     

      {currTab !== '' && (
        <View style={styles.centeredFormContainer}>
          {currTab === 'changeName' && (
            <ProfileForm user={userDetails} updateUser={handleUpdateUser} isSaving={loading} />
          )}

          {currTab === 'changePassword' && (
            <PasswordForm />
          )}

          {currTab === 'changeProfilePicture' && (
            <ProfilePicChange profileImage={profileImage} onEditPress={handleEditPress}/>
          )}

          {currTab === 'emailchange' && (
            <EmailChangeComponent onSave={handleUpdateUser}/>
          )}
        </View>
      )}
  
      {/* Language & Theme Component positioned at 80% of screen height */}
      <LanguageThemeLogout style={styles.languageThemeContainer} />

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#D3D3D3', 
    alignItems: 'center', 
    paddingTop: 20 
  },
  row: { 
    justifyContent: 'space-between', 
    marginBottom: 10 
  },
  optionButton: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: buttonWidth,
    height: 30,
    paddingTop: 6,
    paddingBottom: 6,
    marginVertical:2
  },
  activeOptionButton: {
    backgroundColor: '#00E5FF'
  },
  optionText: { 
    color: 'black',
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },
  activeOptionText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '900',
  },
  centeredFormContainer: {
    position: 'absolute',
    top: '40%'
  },
  languageThemeContainer: {
    position: 'absolute',
    bottom: 30, // 80% from top, 20% from bottom
    alignSelf: 'center',
    // width:buttonWidth,
    backgroundColor:'transparent'
  }
});

export default ProfileScreen;
