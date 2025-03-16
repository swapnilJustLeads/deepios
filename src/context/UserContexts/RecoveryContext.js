import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
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
  const [error, setError] = useState(null);
  const { userDetails } = useUserDetailsContext();
  const [refresh, setRefresh] = useState(false);
  const { globalLoading, setGlobalLoading } = useGlobalContext();

  // ✅ This function is outside `useEffect()` (Same as `fetchUserDetails` in `UserDetailsContext`)
  const fetchRecoveryData = async (username, parentId) => {
    if (!username || !parentId) return; // ✅ Prevent unnecessary calls
    setLoading(true);
    setError(null);
    setGlobalLoading((prev) => ({ ...prev, recoveryDataLoading: true }));

    try {
      const recoveryList = await fetchUserData(username, parentId);
      setRecoveryData(recoveryList);
    } catch (error) {
      console.error("❌ Error fetching recovery data:", error);
      Toast.show({ type: "error", text1: t("toastMessages.errorFetchingSupplement") });
    } finally {
      setGlobalLoading((prev) => ({ ...prev, recoveryDataLoading: false }));
      setLoading(false);
    }
  };

  // ✅ Now calling `fetchRecoveryData()` inside `useEffect()`, just like `UserDetailsContext`
  useEffect(() => {
    if (userDetails?.username && parentIds?.Recovery) {
      fetchRecoveryData(userDetails.username, parentIds.Recovery);
    }
  }, [userDetails, parentIds, refresh]); // ✅ Correct dependencies

  const handleRecoveryUpdateName = async (id, name) => {
    if (!id || !name) {
      Toast.show({ type: "error", text1: t("toastMessages.invalidNameOrId") });
      return;
    }
    try {
      await updateTraningName(id, name);
      setRecoveryData((prevData) =>
        prevData.map((recovery) =>
          recovery.id === id ? { ...recovery, name } : recovery
        )
      );
      Toast.show({ type: "success", text1: t("toastMessages.nameUpdatedSuccess") });
    } catch (error) {
      Toast.show({ type: "error", text1: t("toastMessages.failedToUpdateName") });
    }
  };

  return (
    <UserRecoveryContext.Provider
      value={{
        loading,
        refresh,
        setRefresh,
        recoveryData,
        setRecoveryData,
        handleRecoveryUpdateName,
      }}
    >
      {children}
    </UserRecoveryContext.Provider>
  );
};
