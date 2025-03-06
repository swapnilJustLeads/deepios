import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'; 
import Toast from "react-native-toast-message"; // ✅ Use React Native Toast

import { useUserDetailsContext } from "../UserDetailsContext";
import {
  fetchUserData,
  updateTraningName,
} from "../../firebase/firebaseClient";
import { useDetails } from "../DeatailsContext";
import { useGlobalContext } from "../GlobalContext";

const UserWorkoutContext = createContext();
export const useUserWorkoutContext = () => useContext(UserWorkoutContext);

export const UserWorkoutProvider = ({ children }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [workoutData, setWorkoutData] = useState([]);
  const detailsContext = useDetails();
const parentIds = detailsContext?.parentIds || {}; // ✅ Ensures it never crashes

  const { userDetails } = useUserDetailsContext();
  const [refresh, setRefresh] = useState(false);
  const { globalLoading, setGlobalLoading } = useGlobalContext();

  // Fetch workout data
  const fetchWorkoutData = async () => {
    setLoading(true);
    try {
      const workoutList = await fetchUserData(
        userDetails.username,
        parentIds.Workout
      );
      setWorkoutData(workoutList);
    } catch (error) {
      console.log(error);
      Toast.show({ type: "error", text1: t('toastMessages.errorFetchingWorkout') });
    } finally {
      setGlobalLoading({ ...globalLoading, workoutDataLoading: false });
      setLoading(false);
    }
  };

  // Fetch workout data on component mount
  useEffect(() => {
    if (parentIds?.Workout && userDetails?.username) {
      fetchWorkoutData();
    }
  }, [userDetails, parentIds, refresh]);

  const handleWorkoutUpdateName = async (id, name) => {
    if (!id || !name) {
      Toast.show({ type: "error", text1: t('toastMessages.invalidNameOrId') });
      return;
    }

    Toast.show({ type: "info", text1: t('toastMessages.updatingName') });

    try {
      await updateTraningName(id, name);
      setWorkoutData((prevData) =>
        prevData.map((workout) =>
          workout.id === id ? { ...workout, name } : workout
        )
      );
      Toast.show({ type: "success", text1: t('toastMessages.nameUpdatedSuccess') });
    } catch (error) {
      Toast.show({ type: "error", text1: t('toastMessages.failedToUpdateName') });
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
