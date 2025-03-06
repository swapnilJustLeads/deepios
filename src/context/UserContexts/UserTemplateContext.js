import React, {
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUserTemplates } from "../../firebase/firebase_client";
import { useUserDetailsContext } from "../UserDetailsContext";
import { useTranslation } from "react-i18next";

const UserTemplatesContext = createContext();

export const useUserTemplatesContext = () => useContext(UserTemplatesContext);

export const UserTemplatesProvider = ({ children }) => {
  const { userDetails } = useUserDetailsContext();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [parentId, setParentId] = useState(null);
  const [userTemplates, setUserTemplates] = useState([]);
  const [templateFilteredByParent, setTemplateFilteredByParent] = useState([]);

  const fetchTemplates = async () => {
    if (userDetails?.username) {
      setLoading(true);
      try {
        const templatesList = await getUserTemplates(userDetails.username);
        setUserTemplates(templatesList);
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Username does not exist");
    }
  };

  const handleNewTemplateToState = (template) => {
    setUserTemplates((prev) => [template, ...prev]);
  };

  useEffect(() => {
    setTemplateFilteredByParent(
      userTemplates.filter((template) => template.parent === parentId)
    );
  }, [userTemplates, parentId]);

  useEffect(() => {
    fetchTemplates();
  }, [userDetails?.username]);

  return (
    <UserTemplatesContext.Provider
      value={{
        userTemplates: templateFilteredByParent,
        loading,
        parentId,
        setParentId,
        handleNewTemplateToState,
      }}
    >
      {children}
    </UserTemplatesContext.Provider>
  );
};
