import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useUserDetailsContext } from '../UserDetailsContext';
import { fetchUserData, updateTraningName } from '../../firebase/firebase_client';
import { useDetails } from '../DeatailsContext';
import { useGlobalContext } from '../GlobalContext';

const UserWorkoutContext = createContext();
export const useUserWorkoutContext = () => useContext(UserWorkoutContext);

export const UserWorkoutProvider = ({ children }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [workoutData, setWorkoutData] = useState([]);
  const { parentIds } = useDetails(); // Ensure parentIds exists
  const { userDetails } = useUserDetailsContext();
  const [refresh, setRefresh] = useState(false);
  const { globalLoading, setGlobalLoading } = useGlobalContext();

  // ✅ Stable fetch function to prevent infinite loops
  const fetchWorkoutData = useCallback(async () => {
    if (!userDetails?.username || !parentIds?.Workout) {
      console.log('⚠️ Skipping fetch, missing username or parent ID.');
      return;
    }

    setLoading(true);
    try {
      console.log('⏳ Fetching Workout Data...');
      const workoutList = await fetchUserData(userDetails.username, parentIds.Workout);
      console.log('✅ Workout Data Fetched:', workoutList);

      // ✅ Prevent unnecessary updates
      setWorkoutData((prevData) => {
        if (JSON.stringify(prevData) !== JSON.stringify(workoutList)) {
          return [...workoutList];
        }
        return prevData;
      });
    } catch (error) {
      console.error('❌ Error fetching workout data:', error);
      Toast.show({ type: 'error', text1: t('toastMessages.errorFetchingWorkout') });
    } finally {
      setGlobalLoading((prev) => ({ ...prev, workoutDataLoading: false }));
      setLoading(false);
    }
  }, [userDetails?.username, parentIds?.Workout]);

  // ✅ useEffect now only runs when required
  useEffect(() => {
    fetchWorkoutData();
  }, [userDetails?.username, parentIds?.Workout, refresh]); // Removed unnecessary dependencies

  const handleWorkoutUpdateName = async (id, name) => {
    if (!id || !name) {
      Toast.show({ type: 'error', text1: t('toastMessages.invalidNameOrId') });
      return;
    }

    Toast.show({ type: 'info', text1: t('toastMessages.updatingName') });

    try {
      await updateTraningName(id, name);
      setWorkoutData((prevData) =>
        prevData.map((workout) => (workout.id === id ? { ...workout, name } : workout))
      );
      Toast.show({ type: 'success', text1: t('toastMessages.nameUpdatedSuccess') });
    } catch (error) {
      Toast.show({ type: 'error', text1: t('toastMessages.failedToUpdateName') });
    }
  };

  return (
    <UserWorkoutContext.Provider
      value={{
        loading,
        refresh,
        setRefresh,
        workoutData,
        setWorkoutData,
        handleWorkoutUpdateName,
      }}
    >
      {children}
    </UserWorkoutContext.Provider>
  );
};
