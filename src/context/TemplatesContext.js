import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { useUserDetailsContext } from '../context/UserDetailsContext';
import { getTemplates, addTemplate, deleteTemplate, updateTemplate ,getUserTemplates} from '../firebase/firebase_client';

const TemplatesContext = createContext();
export const useTemplatesContext = () => useContext(TemplatesContext);

export const TemplatesProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const { userDetails } = useUserDetailsContext(); 

  // ✅ Stable fetch function using useCallback
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      console.log('⏳ Fetching Templates...');
      const templatesList = await getTemplates();
      // console.log('✅ Templates Fetched:', templatesList);

      // ✅ Prevent unnecessary updates
      setTemplates((prevData) => {
        if (JSON.stringify(prevData) !== JSON.stringify(templatesList)) {
          return [...templatesList];
        }
        return prevData;
      });
    } catch (error) {
      console.error('❌ Error fetching templates:', error);
      Toast.show({ type: 'error', text1: 'Failed to fetch templates' });
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ useEffect now only runs when required
  useEffect(() => {
    fetchTemplates();
  }, [refresh]); // Runs on refresh trigger


  // ✅ Fetch templates only for the logged-in user
  const fetchUserTemplates = useCallback(async () => {
    if (!userDetails?.username) {
      console.log('⚠️ Skipping fetch, user not logged in.');
      return;
    }

    setLoading(true);
    try {
      console.log(`⏳ Fetching Templates for ${userDetails.username}...`);
      const userTemplates = await getUserTemplates(userDetails.username);
      console.log('✅ User Templates Fetched:', userTemplates);

      // ✅ Prevent unnecessary updates
      setTemplates((prevData) => {
        if (JSON.stringify(prevData) !== JSON.stringify(userTemplates)) {
          return [...userTemplates];
        }
        return prevData;
      });
    } catch (error) {
      console.error('❌ Error fetching user templates:', error);
      Toast.show({ type: 'error', text1: 'Failed to fetch user templates' });
    } finally {
      setLoading(false);
    }
  }, [userDetails?.username]);

  // ✅ useEffect now only runs when required
  useEffect(() => {
    fetchUserTemplates();
  }, [refresh, userDetails?.username]); // Runs when user changes or refresh is triggered

  const addTemplateHandler = async (template) => {
    try {
      if (!template.name) {
        Toast.show({ type: 'error', text1: 'Template name is required' });
        return;
      }

      Toast.show({ type: 'info', text1: 'Saving template...' });

      const newTemplate = await addTemplate(template);
      setTemplates((prevTemplates) => [...prevTemplates, newTemplate]);

      Toast.show({ type: 'success', text1: 'Template added successfully' });
    } catch (error) {
      console.error('❌ Error adding template:', error);
      Toast.show({ type: 'error', text1: 'Failed to add template' });
    }
  };

  const deleteTemplateHandler = async (templateId) => {
    try {
      Toast.show({ type: 'info', text1: 'Deleting template...' });

      await deleteTemplate(templateId);
      setTemplates((prevTemplates) => prevTemplates.filter((t) => t.id !== templateId));

      Toast.show({ type: 'success', text1: 'Template deleted successfully' });
    } catch (error) {
      console.error('❌ Error deleting template:', error);
      Toast.show({ type: 'error', text1: 'Failed to delete template' });
    }
  };

  const updateTemplateHandler = async (templateId, updatedTemplate) => {
    try {
      Toast.show({ type: 'info', text1: 'Updating template...' });

      await updateTemplate(templateId, updatedTemplate);
      setTemplates((prevTemplates) =>
        prevTemplates.map((t) => (t.id === templateId ? { ...t, ...updatedTemplate } : t))
      );

      Toast.show({ type: 'success', text1: 'Template updated successfully' });
    } catch (error) {
      console.error('❌ Error updating template:', error);
      Toast.show({ type: 'error', text1: 'Failed to update template' });
    }
  };

  return (
    <TemplatesContext.Provider
      value={{
        loading,
        refresh,
        setRefresh,
        templates,
        fetchTemplates,
        addTemplate: addTemplateHandler,  // <-- This is the issue
        deleteTemplate: deleteTemplateHandler,
        updateTemplate: updateTemplateHandler,
      }}
    >
      {children}
    </TemplatesContext.Provider>
  );
};
