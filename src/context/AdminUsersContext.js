/* eslint-disable no-catch-shadow */
/* eslint-disable no-shadow */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchUsers, addUser, updateUser, deleteUser, signUpUser, deleteUserCompletely } from '../firebase/firebase_client';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

const AdminUsersContext = createContext();
export const useAdminUsersContext = () => useContext(AdminUsersContext);

export const AdminUsersProvider = ({ children }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const getUsers = useCallback(async () => {
    setLoading(true);
    try {
      const usersList = await fetchUsers();
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers, refresh]);

  const addUserHandler = async (user) => {
    setError(null);
    try {
      if (!user.username || !user.email || !user.password) {
        throw new Error(t('toastMessages.allFieldsRequired'));
      }
      const newUser = await addUser(user);
      const authInstance = getAuth();
      const originalUser = authInstance.currentUser;
      const originalEmail = originalUser?.email;
      const originalPassword = await AsyncStorage.getItem('userPassword');

      try {
        const authUser = await signUpUser(user.email, user.password);
        await updateUser(user.username, { authId: authUser.uid, username: user.username });
        setUsers((prevUsers) => [...prevUsers, { ...newUser, authId: authUser.uid }]);
        Toast.show({ type: 'success', text1: 'User added successfully!' });
      } catch (signupError) {
        await deleteUser(user.username);
        throw signupError;
      } finally {
        if (originalUser) {
          await signInWithEmailAndPassword(authInstance, originalEmail, originalPassword);
        }
      }
    } catch (error) {
      console.log(error);
      Toast.show({ type: 'error', text1: error.message });
      throw error;
    }
  };

  return (
    <AdminUsersContext.Provider value={{ users, loading, error, addUser: addUserHandler }}>
      {children}
    </AdminUsersContext.Provider>
  );
};
