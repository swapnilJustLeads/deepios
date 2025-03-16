/* eslint-disable no-shadow */
import { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, updatePassword, onAuthStateChanged } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { updateSignInTime } from '../firebase_client'; // Import function

const authInstance = getAuth(); // ✅ Use Modular Firebase Auth API

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log('🟢 Attempting login...');
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      
      console.log('✅ Login successful:', userCredential);
      console.log('📧 User Email:', userCredential.user.email);
      console.log('🆔 User UID:', userCredential.user.uid);
      
      await updateSignInTime(userCredential.user.uid);
      await AsyncStorage.setItem('userPassword', password);
      
      Toast.show({ type: 'success', text1: 'Logged in successfully!' });
      
      return userCredential.user; // ✅ Returning user for use in components
    } catch (error) {
      console.error('🔴 Login Error:', error);
      Toast.show({ type: 'error', text1: error.message });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      console.log('🟡 Logging out...');
      await signOut(authInstance);
      await AsyncStorage.removeItem('userPassword');
      Toast.show({ type: 'success', text1: 'Logged out successfully!' });
    } catch (error) {
      console.error('🔴 Logout Error:', error);
      Toast.show({ type: 'error', text1: error.message });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (newPassword) => {
    if (user) {
      try {
        console.log('🟠 Changing password...');
        await updatePassword(user, newPassword);
        Toast.show({ type: 'success', text1: 'Password updated successfully!' });
      } catch (error) {
        console.error('🔴 Password Update Error:', error);
        Toast.show({ type: 'error', text1: error.message });
      }
    }
  };

  return { user, loading, login, logout, changePassword };
};
