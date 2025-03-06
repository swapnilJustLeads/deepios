import React, { createContext, useContext, useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getSupplementReminders, addSupplementReminder, updateSupplementReminder, deleteSupplementReminder } from '../../firebase/firebase_client';
import { useUserDetailsContext } from '../UserDetailsContext';

const ReminderSupplementContext = createContext();
export const useReminderSupplementContext = () => useContext(ReminderSupplementContext);

export const ReminderSupplementProvider = ({ children }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [supplementReminders, setSupplementReminders] = useState([]);
  const { userDetails } = useUserDetailsContext();

  useEffect(() => {
    if (userDetails?.username) {
      getSupplementReminders(userDetails.username).then(reminders => {
        setSupplementReminders(reminders.sort((a, b) => new Date(a.endDate) - new Date(b.endDate)));
        setLoading(false);
      }).catch(error => {
        console.error('Error fetching supplement reminders:', error);
        setLoading(false);
      });
    }
  }, [userDetails]);

  return (
    <ReminderSupplementContext.Provider value={{ loading, supplementReminders }}>
      {children}
    </ReminderSupplementContext.Provider>
  );
};
