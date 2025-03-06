import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTemplates, addTemplate, deleteTemplate, updateTemplate } from '../firebase/firebase_client';
import { ToastAndroid } from 'react-native';

const TemplatesContext = createContext();
export const useTemplatesContext = () => useContext(TemplatesContext);

export const TemplatesProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   fetchTemplates();
  // }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const templatesList = await getTemplates();
      setTemplates(templatesList);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTemplateHandler = async (template) => {
    setSaving(true);
    try {
      if (!template.name) throw new Error('Template name is required.');
      const newTemplate = await addTemplate(template);
      setTemplates((prevTemplates) => [...prevTemplates, newTemplate]);
      ToastAndroid.show('Template added successfully!', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error adding template:', error);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    } finally {
      setSaving(false);
    }
  };

  return (
    <TemplatesContext.Provider value={{ templates, loading, addTemplate: addTemplateHandler }}>
      {children}
    </TemplatesContext.Provider>
  );
};
