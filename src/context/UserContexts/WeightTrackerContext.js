import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message"; // ✅ Use React Native Toast

import {
  getWeightTracker as getWeightEntries,
  addWeightTracker as addWeightEntry,
  deleteWeightTracker as deleteWeightEntry,
} from "../../firebase/firebase_client";
import { useUserDetailsContext } from "../UserDetailsContext";

const WeightTrackerContext = createContext();
export const useWeightTrackerContext = () => useContext(WeightTrackerContext);

export const WeightTrackerProvider = ({ children }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [addingEntry, setAddingEntry] = useState(false);
  const [deletingEntry, setDeletingEntry] = useState(false);
  const [weightEntries, setWeightEntries] = useState([]);
  const { userDetails } = useUserDetailsContext();

  useEffect(() => {
    if (userDetails?.username) {
      getWeightEntries(userDetails.username)
        .then((entries) => {
          // Sort entries by date in descending order (newest first)
          const sortedEntries = entries.sort((a, b) => a.date.seconds - b.date.seconds);
          setWeightEntries(sortedEntries);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching weight entries:", error);
          setLoading(false);
          Toast.show({ type: "error", text1: t("toastMessages.errorFetchingWeightEntries") });
        });
    }
  }, [userDetails]);

  const handleAddWeightEntry = async (weightData) => {
    try {
      setAddingEntry(true);
      const res = await addWeightEntry({
        ...weightData,
        username: userDetails.username,
      });

      // Insert the new entry into the weightEntries array while maintaining the sorted order
      const newWeightEntries = [...weightEntries, res];
      newWeightEntries.sort((a, b) => a.date.seconds - b.date.seconds);
      setWeightEntries(newWeightEntries);

      Toast.show({ type: "success", text1: t("toastMessages.weight_entry_added") });
    } catch (error) {
      console.error("Error adding weight entry:", error);
      Toast.show({ type: "error", text1: t("toastMessages.add_weight_entry_failed") });
    } finally {
      setAddingEntry(false);
    }
  };

  const handleDeleteWeightEntry = async (entryId) => {
    if (!userDetails?.username) {
      Toast.show({ type: "error", text1: t("toastMessages.user_not_found") });
      return;
    }

    try {
      setDeletingEntry(true);
      await deleteWeightEntry(entryId);
      setWeightEntries(weightEntries.filter((entry) => entry.id !== entryId));
      Toast.show({ type: "success", text1: t("toastMessages.weight_entry_deleted") });
    } catch (error) {
      console.error("Error deleting weight entry:", error);
      Toast.show({ type: "error", text1: t("toastMessages.delete_weight_entry_failed") });
    } finally {
      setDeletingEntry(false);
    }
  };

  return (
    <WeightTrackerContext.Provider
      value={{
        loading,
        addingEntry,
        deletingEntry,
        weightEntries,
        addWeightEntry: handleAddWeightEntry,
        deleteWeightEntry: handleDeleteWeightEntry,
      }}
    >
      {children}
    </WeightTrackerContext.Provider>
  );
};
