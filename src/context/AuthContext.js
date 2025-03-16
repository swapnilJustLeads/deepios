// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await auth().signInWithEmailAndPassword(email, password);
      
      // Fetch additional user data from Firestore if needed
      if (response.user) {
        const userDoc = await firestore()
          .collection('users')
          .doc(response.user.uid)
          .get();
          
        // Store user data in AsyncStorage for offline access
        if (userDoc.exists) {
          await AsyncStorage.setItem('userData', JSON.stringify(userDoc.data()));
        }
        
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: `Welcome back, ${response.user.email}!`
        });
      }
      
      setLoading(false);
      return response.user;
    } catch (error) {
      setLoading(false);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      }
      
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage
      });
      
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem('userData');
      Toast.show({
        type: 'success',
        text1: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error', error);
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'Something went wrong. Please try again.'
      });
    }
  };

  // Register
  const register = async (email, password, userData) => {
    setLoading(true);
    try {
      const response = await auth().createUserWithEmailAndPassword(email, password);
      
      if (response.user) {
        // Add user profile data to Firestore
        await firestore()
          .collection('users')
          .doc(response.user.uid)
          .set({
            ...userData,
            email,
            userId: response.user.uid,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
          
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: 'Your account has been created!'
        });
      }
      
      setLoading(false);
      return response.user;
    } catch (error) {
      setLoading(false);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'That email address is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      }
      
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: errorMessage
      });
      
      throw error;
    }
  };

  // Reset Password
  const resetPassword = async (email) => {
    try {
      await auth().sendPasswordResetEmail(email);
      Toast.show({
        type: 'success',
        text1: 'Password Reset Email Sent',
        text2: 'Please check your email to reset your password.'
      });
      return true;
    } catch (error) {
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      }
      
      Toast.show({
        type: 'error',
        text1: 'Reset Password Failed',
        text2: errorMessage
      });
      
      throw error;
    }
  };

  // Update User Profile
  const updateProfile = async (userData) => {
    try {
      if (user) {
        await firestore()
          .collection('users')
          .doc(user.uid)
          .update(userData);
          
        // Update local storage
        const currentData = await AsyncStorage.getItem('userData');
        if (currentData) {
          const parsedData = JSON.parse(currentData);
          await AsyncStorage.setItem('userData', JSON.stringify({...parsedData, ...userData}));
        }
        
        Toast.show({
          type: 'success',
          text1: 'Profile Updated',
          text2: 'Your profile has been successfully updated.'
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update profile error', error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Failed to update profile. Please try again.'
      });
      throw error;
    }
  };

  // Get Current User Data
  const getUserData = async () => {
    try {
      if (user) {
        const userDoc = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();
          
        if (userDoc.exists) {
          return userDoc.data();
        }
      }
      return null;
    } catch (error) {
      console.error('Get user data error', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initializing,
        login,
        logout,
        register,
        resetPassword,
        updateProfile,
        getUserData
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier access to auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};