import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../firebase/hooks/auth"; // Import useAuth hook
import {
  getUserDetails,
  updateUserDetails as updateUserDetailsInFirebase,
} from "../firebase/firebase_client"; // Import functions from firebase_client
import { useGlobalContext } from "./GlobalContext";
import { useTranslation } from "react-i18next";


const UserDetailsContext = createContext();

export const useUserDetailsContext = () => useContext(UserDetailsContext);

export const UserDetailsProvider = ({ children }) => {
  const { user } = useAuth(); // Get the authenticated user
  const { t } = useTranslation();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { globalLoading, setGlobalLoading } = useGlobalContext();
  useEffect(() => {
    if (user && user.uid) {
      console.log("👤 User from useAuth():", user);
  
      // ✅ Fetch user details using UID
      fetchUserDetails(user.uid);
    }
  }, [user]);
  
  
  useEffect(() => {
    if (user) {
      fetchUserDetails(user.uid); // Fetch user details using the authenticated user's ID
    }
  }, [user]);

  const fetchUserDetails = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const userDetails = await getUserDetails(userId);
      setUserDetails(userDetails);
      setIsAdmin(userDetails.isAdmin || false); // Set isAdmin based on user details
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError(error.message);
      setGlobalLoading({ userDetailsLoading: false });
    } finally {
      setGlobalLoading({ ...globalLoading, userDetailsLoading: false });
      setLoading(false);
    }
  };

  const updateUserDetails = async (updatedDetails) => {
    setSaving(true);
    setError(null);
    try {
      await updateUserDetailsInFirebase(userDetails.username, updatedDetails);
      setUserDetails((prevDetails) => ({ ...prevDetails, ...updatedDetails }));
    } catch (error) {
      console.error("Error updating user details:", error);
      setError(error.message);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return (
    <UserDetailsContext.Provider
      value={{
        userDetails,
        loading,
        saving,
        error,
        fetchUserDetails,
        updateUserDetails,
        isAdmin, // Provide isAdmin in context
      }}
    >
      {children}
    </UserDetailsContext.Provider>
  );
};
