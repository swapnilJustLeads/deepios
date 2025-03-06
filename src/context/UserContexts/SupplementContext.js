import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message'; // ✅ Use React Native Toast

import { useUserDetailsContext } from '../UserDetailsContext';
import { fetchUserData, updateTraningName } from '../../firebase/firebaseClient';
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

  // Fetch supplement data when component mounts
  useEffect(() => {
    const fetchSupplementData = async () => {
      setLoading(true);
      try {
        const supplementList = await fetchUserData(userDetails.username, parentIds.Supplement);
        setSupplementData(supplementList);
      } catch (error) {
        console.log(error);
        Toast.show({ type: "error", text1: t('toastMessages.errorFetchingSupplement') });
      } finally {
        setGlobalLoading({ ...globalLoading, supplementDataLoading: false });
        setLoading(false);
      }
    };

    if (parentIds?.Supplement && userDetails?.username) {
      fetchSupplementData();
    }
  }, [userDetails, parentIds, refresh, t, setGlobalLoading, globalLoading]);

  const handleSupplementUpdateName = async (id, name) => {
    if (!id || !name) {
      Toast.show({ type: "error", text1: t('toastMessages.invalidNameOrId') });
      return;
    }

    Toast.show({ type: "info", text1: t('toastMessages.updatingName') });

    try {
      await updateTraningName(id, name);
      setSupplementData((prevData) =>
        prevData.map((supplement) =>
          supplement.id === id ? { ...supplement, name } : supplement
        )
      );
      Toast.show({ type: "success", text1: t('toastMessages.nameUpdatedSuccess') });
    } catch (error) {
      Toast.show({ type: "error", text1: t('toastMessages.failedToUpdateName') });
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
