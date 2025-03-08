import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message"; // ✅ Use React Native Toast
import { useUserDetailsContext } from "../UserDetailsContext";
import { fetchUserData, updateTraningName } from "../../firebase/firebase_client";
import { useDetails } from "../DeatailsContext";
import { useGlobalContext } from "../GlobalContext";

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

  // ✅ Function moved outside `useEffect()` (Same as `fetchUserDetails` in `UserDetailsContext`)
  const fetchCardioData = async (username, parentId) => {
    if (!username || !parentId) return; // ✅ Prevent unnecessary calls
    setLoading(true);
    setGlobalLoading((prev) => ({ ...prev, cardioDataLoading: true }));

    try {
      const cardioList = await fetchUserData(username, parentId);
      setCardioData(cardioList);
    } catch (error) {
      console.error("❌ Error fetching cardio data:", error);
      Toast.show({ type: "error", text1: t("toastMessages.errorFetchingCardio") });
    } finally {
      setGlobalLoading((prev) => ({ ...prev, cardioDataLoading: false }));
      setLoading(false);
    }
  };

  // ✅ Now calling `fetchCardioData()` inside `useEffect()`, just like `UserDetailsContext`
  useEffect(() => {
    if (userDetails?.username && parentIds?.Cardio) {
      fetchCardioData(userDetails.username, parentIds.Cardio);
    }
  }, [userDetails, parentIds, refresh]); // ✅ Correct dependencies

  const handleCardioUpdateName = async (id, name) => {
    if (!id || !name) {
      Toast.show({ type: "error", text1: t("toastMessages.invalidNameOrId") });
      return;
    }

    Toast.show({ type: "info", text1: t("toastMessages.updatingName") });

    try {
      await updateTraningName(id, name);
      setCardioData((prevData) =>
        prevData.map((cardio) => (cardio.id === id ? { ...cardio, name } : cardio))
      );
      Toast.show({ type: "success", text1: t("toastMessages.nameUpdatedSuccess") });
    } catch (error) {
      Toast.show({ type: "error", text1: t("toastMessages.nameUpdateError") });
    }
  };

  return (
    <UserCardioContext.Provider
      value={{
        loading,
        refresh,
        setRefresh,
        cardioData,
        setCardioData,
        handleCardioUpdateName,
      }}
    >
      {children}
    </UserCardioContext.Provider>
  );
};
