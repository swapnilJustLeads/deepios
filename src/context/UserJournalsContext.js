import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getJournals,
  addJournal as addJournalToFirebase,
  deleteJournal as deleteJournalFromFirebase,
} from "../firebase/firebase_client";
import { useUserDetailsContext } from "./UserDetailsContext";
import Toast from "react-native-toast-message";  // ✅ Use React Native Toast
import { useGlobalContext } from "./GlobalContext";
import { useTranslation } from 'react-i18next';

const UserJournalsContext = createContext();

export const useUserJournalsContext = () => useContext(UserJournalsContext);

export const UserJournalsProvider = ({ children }) => {
  const { t } = useTranslation();
  const { userDetails } = useUserDetailsContext();
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const { globalLoading, setGlobalLoading } = useGlobalContext();

  useEffect(() => {
    if (userDetails) {
      fetchUserJournals(userDetails.username);
    }
  }, [userDetails]);

  const fetchUserJournals = async (username) => {
    setLoading(true);
    setError(null);
    try {
      const userJournals = await getJournals(username);
      userJournals.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
      setJournals(userJournals);
    } catch (error) {
      console.error("Error fetching user journals:", error);
      setError(error.message);
      Toast.show({ type: "error", text1: t('toastMessages.errorFetchingJournals') });
    } finally {
      setGlobalLoading({ ...globalLoading, journalLoading: false });
      setLoading(false);
    }
  };

  const addJournal = async (note, createdAt) => {
    setAdding(true);
    setError(null);
    try {
      const newJournal = {
        note,
        userId: userDetails.username,
        createdAt: createdAt,
      };
      const newJ = await addJournalToFirebase(newJournal);
      setJournals((prevJournals) => [newJ, ...prevJournals]);
      Toast.show({ type: "success", text1: t('toastMessages.journalAddedSuccess') });
    } catch (error) {
      console.error("Error adding journal:", error);
      setError(error.message);
      Toast.show({ type: "error", text1: t('toastMessages.failedToAddJournal') });
    } finally {
      setAdding(false);
    }
  };

  const deleteJournal = async (id) => {
    setError(null);
    Toast.show({ type: "info", text1: t('toastMessages.deletingJournal') });
    try {
      await deleteJournalFromFirebase(id);
      setJournals((prevJournals) =>
        prevJournals.filter((journal) => journal.id !== id)
      );
      Toast.show({ type: "success", text1: t('toastMessages.journalDeletedSuccess') });
    } catch (error) {
      console.error("Error deleting journal:", error);
      setError(error.message);
      Toast.show({ type: "error", text1: t('toastMessages.failedToDeleteJournal') });
    }
  };

  return (
    <UserJournalsContext.Provider
      value={{
        journals,
        loading,
        adding,
        error,
        fetchUserJournals,
        addJournal,
        deleteJournal,
      }}
    >
      {children}
    </UserJournalsContext.Provider>
  );
};
