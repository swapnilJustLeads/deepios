import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getParents,
  getCategories,
  getSubCategories,
  addCategory,
  addSubCategory,
} from '../firebase/firebase_client';

const DeatailsContext = createContext();

export const useDetails = () => {
  return useContext(DeatailsContext);
};

export const DetailsProvider = ({ children }) => {
  const [parents, setParents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [parentIds, setParentIds] = useState({});
  const [errorMessage, setErrorMessage] = useState(null); // ✅ Store error message safely

  useEffect(() => {
    parents.forEach((parent) => {
      setParentIds((prev) => ({ ...prev, [parent.name]: parent.id }));
    });
  }, [parents]);

  useEffect(() => {
    const subCategoriesMap = subCategories.reduce((acc, subCategory) => {
      acc[subCategory.id] = subCategory;
      return acc;
    }, {});

    setSubCategoriesMap(subCategoriesMap);
  }, [subCategories]);

  useEffect(() => {
    const fetchParents = async () => {
      setLoading(true);
      try {
        const parentsData = await getParents();
        setParents(parentsData);
      } catch (error) {
        console.error('Error fetching parents:', error);
        setErrorMessage('Error fetching parents'); // ✅ Store error safely
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setErrorMessage('Error fetching categories'); // ✅ Store error safely
      }
    };

    const fetchSubCategories = async () => {
      try {
        const subCategoriesData = await getSubCategories();
        setSubCategories(subCategoriesData);
      } catch (error) {
        console.error('Error fetching sub categories:', error);
        setErrorMessage('Error fetching sub categories'); // ✅ Store error safely
      }
    };

    fetchSubCategories();
    fetchCategories();
    fetchParents();
  }, []);

  const createCategory = async (category) => {
    try {
      const newCat = await addCategory(category);
      setCategories((prevCategories) => [...prevCategories, newCat]);
    } catch (error) {
      console.error('Error creating category:', error);
      setErrorMessage('Error creating category'); // ✅ Store error safely
      throw error;
    }
  };

  const createSubCategory = async (subCategory) => {
    try {
      const newSub = await addSubCategory(subCategory);
      setSubCategories((prevSubCategories) => [...prevSubCategories, newSub]);
    } catch (error) {
      console.error('Error creating subcategory:', error);
      setErrorMessage('Error creating subcategory'); // ✅ Store error safely
      throw error;
    }
  };

  return (
    <DeatailsContext.Provider
      value={{
        parents,
        parentIds,
        categories,
        subCategories,
        createCategory,
        createSubCategory,
        isLoading: loading,
        subCategoriesMap,
        errorMessage, // ✅ Store errors in state instead of rendering raw strings
      }}
    >
      {children}
    </DeatailsContext.Provider>
  );
};
