
import React, { useState } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Button, Text } from '@rneui/themed';
import { useTranslation } from 'react-i18next';

export const ProfileForm = ({ user, updateUser, isSaving }) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });
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
    <View style={styles.container}>
      <Text style={styles.label}>{t('firstName')}</Text>
      <TextInput
        style={styles.input}
        value={userData.firstName}
        onChangeText={(text) => setUserData({ ...userData, firstName: text })}
      />
      <Text style={styles.label}>{t('lastName')}</Text>
      <TextInput
        style={styles.input}
        value={userData.lastName}
        onChangeText={(text) => setUserData({ ...userData, lastName: text })}
      />
      <Button
        title={loading ? <ActivityIndicator color="#fff" /> : t('save')}
        onPress={handleSave}
        buttonStyle={styles.saveButton}
        disabled={isSaving || !userData.firstName}
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
      setError('Please fill in both password fields');
      return;
    }

    if (newPassword !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      await changePassword(newPassword);
      console.log('Password updated successfully!');
      setNewPassword('');
      setRepeatPassword('');
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        setReauthenticateRequired(true);
      } else {
        console.error('Error updating password:', error);
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
      console.log('Password updated successfully after re-authentication!');
      setReauthenticateRequired(false);
    } catch (error) {
      console.error('Error re-authenticating:', error);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {reauthenticateRequired ? (
        <>
          <Text style={styles.label}>{t('email')}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Text style={styles.label}>{t('password')}</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            title={isSaving ? 'RE-AUTHENTICATING...' : 'RE-AUTHENTICATE'}
            onPress={handleReauthenticate}
            buttonStyle={styles.reauthButton}
            disabled={isSaving}
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>{t('newPassword')}</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <Text style={styles.label}>{t('repeatNewPassword')}</Text>
          <TextInput
            style={styles.input}
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            secureTextEntry
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Button
            title={isSaving ? <ActivityIndicator color="#fff" /> : t('save')}
            onPress={handleChangePassword}
            buttonStyle={styles.saveButton}
            disabled={isSaving || !newPassword || !repeatPassword}
          />
        </>
      )}
    </View>
  );
};

// ✅ Styles to match Figma
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: 212,
    height: 155,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#000',
    padding: 19,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  input: {
    width: '100%',
    height: 35,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 2,
    width: 90,
    height: 30,
    backgroundColor: '#000',
    borderRadius: 8,
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
});

export default ProfileForm;
