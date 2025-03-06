import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ToastAndroid } from "react-native";
import { useUserDetailsContext } from "../UserDetailsContext";
import { fetchUserData, updateTraningName } from "../../firebase/firebase_client";
import { useDetails } from "../DeatailsContext";
import { useGlobalContext } from "../GlobalContext";

const UserRecoveryContext = createContext();
export const useUserRecoveryContext = () => useContext(UserRecoveryContext);

export const UserRecoveryProvider = ({ children }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [recoveryData, setRecoveryData] = useState([]);
  const { parentIds } = useDetails();
  const { userDetails } = useUserDetailsContext();
  const [refresh, setRefresh] = useState(false);
  const { globalLoading, setGlobalLoading } = useGlobalContext();



  useEffect(() => {
    const fetchRecoveryData = async () => {
      setLoading(true);
      try {
        const recoveryList = await fetchUserData(userDetails.username, parentIds.Recovery);
        setRecoveryData(recoveryList);
      } catch (error) {
        console.log(error);
        ToastAndroid.show(t('toastMessages.errorFetchingRecovery'), ToastAndroid.SHORT);
      } finally {
        setGlobalLoading({ ...globalLoading, recoveryDataLoading: false });
        setLoading(false);
      }
    };
    if (parentIds?.Recovery && userDetails?.username) {
      fetchRecoveryData();
    }
  }, [userDetails, parentIds, refresh, t, setGlobalLoading, globalLoading]);

  const handleRecoveryUpdateName = async (id, name) => {
    if (!id || !name) {
      ToastAndroid.show(t('toastMessages.invalidNameOrId'), ToastAndroid.SHORT);
      return;
    }
    try {
      await updateTraningName(id, name);
      setRecoveryData(prevData => prevData.map(recovery => recovery.id === id ? { ...recovery, name } : recovery));
      ToastAndroid.show(t('toastMessages.nameUpdatedSuccess'), ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(t('toastMessages.failedToUpdateName'), ToastAndroid.SHORT);
    }
  };

  return (
    <UserRecoveryContext.Provider value={{ loading, refresh, setRefresh, recoveryData, setRecoveryData, handleRecoveryUpdateName }}>
      {children}
    </UserRecoveryContext.Provider>
  );
};
