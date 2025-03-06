import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastAndroid } from 'react-native';
import { useUserDetailsContext } from '../UserDetailsContext';
import { fetchUserData, updateTraningName } from '../../firebase/firebase_client';
import { useDetails } from '../DeatailsContext';
import { useGlobalContext } from '../GlobalContext';

const UserCardioContext = createContext();
export const useUserCardioContext = () => useContext(UserCardioContext);

export const UserCardioProvider = ({ children }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [cardioData, setCardioData] = useState([]);
  const { parentIds } = useDetails();
  const { userDetails } = useUserDetailsContext();
  const [refresh, setRefresh] = useState(false);
  const { globalLoading, setGlobalLoading } = useGlobalContext();



  useEffect(() => {
    const fetchCardioData = async () => {
      setLoading(true);
      try {
        const cardioList = await fetchUserData(userDetails.username, parentIds.Cardio);
        setCardioData(cardioList);
      } catch (error) {
        console.log(error);
        ToastAndroid.show(t('toastMessages.errorFetchingCardio'), ToastAndroid.SHORT);
      } finally {
        setGlobalLoading({ ...globalLoading, cardioDataLoading: false });
        setLoading(false);
      }
    };
    if (parentIds?.Cardio && userDetails?.username) {
      fetchCardioData();
    }
  }, [userDetails, parentIds, refresh, t, setGlobalLoading, globalLoading]);

  const handleCardioUpdateName = async (id, name) => {
    if (!id || !name) {
      ToastAndroid.show(t('toastMessages.invalidNameOrId'), ToastAndroid.SHORT);
      return;
    }
    try {
      await updateTraningName(id, name);
      setCardioData(prevData => prevData.map(cardio => cardio.id === id ? { ...cardio, name } : cardio));
      ToastAndroid.show(t('toastMessages.nameUpdatedSuccess'), ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(t('toastMessages.failedToUpdateName'), ToastAndroid.SHORT);
    }
  };

  return (
    <UserCardioContext.Provider value={{ loading, refresh, setRefresh, cardioData, setCardioData, handleCardioUpdateName }}>
      {children}
    </UserCardioContext.Provider>
  );
};
