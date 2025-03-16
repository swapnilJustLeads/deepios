import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message'; // ✅ Use React Native Toast
import { useUserDetailsContext } from '../UserDetailsContext';
import { fetchUserData, updateTraningName } from '../../firebase/firebase_client';
import { useDetails } from '../DeatailsContext';
import { useGlobalContext } from '../GlobalContext';

const UserSupplementContext = createContext();
export const useUserSupplementContext = () => useContext(UserSupplementContext);

export const UserSupplementProvider = ({ children }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [supplementData, setSupplementData] = useState([]);
  const { parentIds } = useDetails();
  const { userDetails } = useUserDetailsContext();
  const [refresh, setRefresh] = useState(false);
  const { globalLoading, setGlobalLoading } = useGlobalContext();

  // ✅ Function moved outside `useEffect()` (Same as `fetchUserDetails` in `UserDetailsContext`)
  const fetchSupplementData = async (username, parentId) => {
    if (!username || !parentId) return; // ✅ Prevent unnecessary calls
    setLoading(true);
    setGlobalLoading((prev) => ({ ...prev, supplementDataLoading: true }));

    try {
      const supplementList = await fetchUserData(username, parentId);
      setSupplementData(supplementList);
    } catch (error) {
      console.error('❌ Error fetching supplement data:', error);
      Toast.show({ type: 'error', text1: t('toastMessages.errorFetchingSupplement') });
    } finally {
      setGlobalLoading((prev) => ({ ...prev, supplementDataLoading: false }));
      setLoading(false);
    }
  };

  // ✅ Now calling `fetchSupplementData()` inside `useEffect()`, just like `UserDetailsContext`
  useEffect(() => {
    if (userDetails?.username && parentIds?.Supplement) {
      fetchSupplementData(userDetails.username, parentIds.Supplement);
    }
  }, [userDetails, parentIds, refresh]); // ✅ Correct dependencies

  const handleSupplementUpdateName = async (id, name) => {
    if (!id || !name) {
      Toast.show({ type: 'error', text1: t('toastMessages.invalidNameOrId') });
      return;
    }

    Toast.show({ type: 'info', text1: t('toastMessages.updatingName') });

    try {
      await updateTraningName(id, name);
      setSupplementData((prevData) =>
        prevData.map((supplement) =>
          supplement.id === id ? { ...supplement, name } : supplement
        )
      );
      Toast.show({ type: 'success', text1: t('toastMessages.nameUpdatedSuccess') });
      console.log('succes')
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: t('toastMessages.failedToUpdateName') });
    }
  };

  return (
    <UserSupplementContext.Provider
      value={{
        loading,
        refresh,
        setRefresh,
        supplementData,
        setSupplementData,
        handleSupplementUpdateName,
      }}
    >
      {children}
    </UserSupplementContext.Provider>
  );
};
