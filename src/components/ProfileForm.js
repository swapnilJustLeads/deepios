
import React, { useState,useEffect } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator ,Image,TouchableOpacity} from 'react-native';
import { Button, Text ,Input} from '@rneui/themed';
import { useTranslation } from 'react-i18next';

export const ProfileForm = ({ user, updateUser, isSaving }) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    profileImage: '',
  });

  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        profileImage: user.profileImage || 'https://your-default-image-url.com/profile.png',
      });
    }
  }, [user]);
  const [loading, setLoading] = useState(false);
  

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUser(userData);
    } catch (error) {
      console.log('Error saving changes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container1}>
    <Text style={styles.label}>FIRSTNAME</Text>
    <TextInput
      style={styles.input1}
      value={userData.firstName}
      onChangeText={(text) => setUserData({ ...userData, firstName: text })}
      placeholder="Enter first name"
    />
    
    <Text style={styles.label}>LASTNAME</Text>
    <TextInput
      style={styles.input1}
      value={userData.lastName}
      onChangeText={(text) => setUserData({ ...userData, lastName: text })}
      placeholder="Enter last name"
    />
    
    <Button 
        title={
          <Text style={styles.saveButtonText}>SAVE</Text>
        }
        buttonStyle={styles.saveButton}
        titleStyle={styles.saveButtonText}
        onPress={handleSave}
      />
  </View>
  );
};
export const PasswordForm = ({ changePassword, reauthenticate }) => {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [reauthenticateRequired, setReauthenticateRequired] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChangePassword = async () => {
    if (!newPassword || !repeatPassword) {
      setError(t('fillBothPasswordFields'));
      return;
    }

    if (newPassword !== repeatPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      await changePassword(newPassword);
      console.log(t('passwordUpdatedSuccessfully'));
      setNewPassword('');
      setRepeatPassword('');
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setReauthenticateRequired(true);
      } else {
        console.error(t('errorUpdatingPassword'), error);
        setError(error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReauthenticate = async () => {
    setError(null);
    setIsSaving(true);
    try {
      await reauthenticate(email, password);
      await changePassword(newPassword);
      console.log(t('passwordUpdatedAfterReauth'));
      setReauthenticateRequired(false);
    } catch (error) {
      console.error(t('errorReauthenticating'), error);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container1}>
      {reauthenticateRequired ? (
        <>
          <Text style={styles.label}>{t('email')}</Text>
          <TextInput
            style={styles.input1}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Text style={styles.label}>{t('password')}</Text>
          <TextInput
            style={styles.input1}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            title={isSaving ? t('reauthenticating') : t('reauthenticate')}
            onPress={handleReauthenticate}
            buttonStyle={styles.reauthButton}
            disabled={isSaving}
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>NEW PASSWORD</Text>
          <TextInput
            style={styles.input1}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <Text style={styles.label}>REPEAT NEW PASSWORD</Text>
          <TextInput
            style={styles.input1}
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            secureTextEntry
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Button
            title={isSaving ? <ActivityIndicator color="#fff" /> : t('SAVE')}
            onPress={handleChangePassword}
            buttonStyle={styles.saveButton}
            disabled={isSaving || !newPassword || !repeatPassword}
            titleStyle={styles.saveButtonText}
          />
        </>
      )}
    </View>
  );
};
export const ProfilePicChange = ({ profileImage ,onEditPress}) => {
  console.log("here is dp bro",profileImage)

  return (
    <View style={styles.container1}>
      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: profileImage }}
          style={styles.profileImage}
          resizeMode="cover"
        />
        <TouchableOpacity 
          style={styles.editButton}
          onPress={onEditPress} 
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: 'https://dashboard.codeparrot.ai/api/image/Z8qq97wkNXOiaWFI/svg.png' }}
            style={styles.editIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export const EmailChangeComponent = ({ onSave = () => {} }) => {
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');

  const handleSave = () => {
    if (newEmail && confirmEmail) {
      onSave({ newEmail, confirmEmail });
    }
  };

  return (
    <View style={styles.container1}>
      <Text style={styles.label}>NEW EMAIL</Text>
      <TextInput
        style={styles.input1}
        value={newEmail}
        onChangeText={setNewEmail}
        placeholder="Enter new email"
      />
      
      <Text style={styles.label}>CONFIRM EMAIL</Text>
      <TextInput
        style={styles.input1}
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        placeholder="Confirm email"
      />

      <Button 
        title="SAVE"
        buttonStyle={styles.saveButton}
        titleStyle={styles.saveButtonText}
        onPress={handleSave}
      />
    </View>
  );
};


// ✅ Styles to match Figma
const styles = StyleSheet.create({
  container: {
    // marginTop: 20,
    // width: 212,
    // height: 155,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#000',
    // padding: 19,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
    alignSelf: 'center',
    marginBottom: 2,
  },
  input: {
    width: 173,
    height: 24,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  saveButton: {
     marginTop: 5,
    width: 90,
    height: 28,
    backgroundColor: '#000',
    borderRadius: 20,
    alignItems:'center',
    justifyContent:'center'
  },
  reauthButton: {
    width: 172,
    height: 35,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    marginBottom: 5,
  },
  container1: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#000000',
    padding: 20,
    width: 212,
    alignItems: 'center',
  },
  label1: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 5,
    color: '#000000',
  },
  input1: {
    width: 173,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '400',
  },
  saveButton1: {
    width: 90,
    height: 18,
    backgroundColor: '#000000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  profileContainer: {
    width: 130,
    height: 130,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 9999,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: '#B0B0B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    width: 10,
    height: 10,
  },
  inputContainer: {
    width: 173,
    height: 24,
    marginBottom: 12,
  },
});

export default ProfileForm;

