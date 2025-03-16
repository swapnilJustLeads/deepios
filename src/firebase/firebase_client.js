import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp
} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth ,deleteUser as firebaseDeleteUser , EmailAuthProvider , reauthenticateWithCredential , updateEmail} from '@react-native-firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from '@react-native-firebase/storage';
import { COLLECTIONS } from './collections';

export const FirestoreDB = getFirestore();
export const FirebaseAuth = getAuth();
export const FirebaseStorage = getStorage();

// ✅ Fetch all users (Updated)
export const fetchUsers = async () => {
  try {
    const usersCollectionRef = collection(FirestoreDB, COLLECTIONS.USERS);
    const querySnapshot = await getDocs(usersCollectionRef);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserDetails = async (userId) => {
  try {
    console.log(`📢 Fetching Firestore data for UID: ${userId}`);
    const usersCollectionRef = collection(FirestoreDB, 'users');
    const q = query(usersCollectionRef, where('authId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn('⚠️ No user data found for UID:', userId);
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error('❌ Firestore Error:', error);
    throw error;
  }
};

// ✅ Add new user (Updated)
export const addUser = async (user) => {
  try {
    if (!user.username || !user.email) {
      throw new Error('All fields are required.');
    }

    const userDocRef = doc(FirestoreDB, COLLECTIONS.USERS, user.username);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists) {
      throw new Error('Username already exists.');
    }

    await setDoc(userDocRef, { email: user.email, language: 'en' });

    return { id: user.username, ...user };
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// ✅ Upload profile picture (Updated)

export const uploadProfilePicture = async (username, fileUri) => {
  try {
    const user = FirebaseAuth.currentUser;

    if (!user) {
      throw new Error('No authenticated user found!');
    }

    if (!fileUri) {
      throw new Error('Invalid file URI received.');
    }

    console.log('📸 Uploading File:', fileUri);

    // Create a reference to the file location in Firebase Storage
    const storageRef = ref(FirebaseStorage, `profile_pictures/${user.uid}.jpg`);
    
    // For React Native, you need to get the blob from the local file
    const response = await fetch(fileUri);
    const blob = await response.blob();
    
    // Now use the blob with uploadBytesResumable
    const task = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      task.on(
        'state_changed',
        snapshot => {
          console.log(`Upload Progress: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`);
        },
        error => {
          console.error('❌ Error uploading file:', error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(storageRef);
          console.log('✅ File uploaded successfully:', downloadURL);

          // Store download URL in Firestore under user's document
          await updateDoc(doc(FirestoreDB, COLLECTIONS.USERS, user.uid), {
            profilePicture: downloadURL,
          });

          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error('❌ Error in uploadProfilePicture:', error);
    throw error;
  }
};



// ✅ Fix: Ensure the document exists before updating
export const updateSignInTime = async (userId) => {
  try {
    const userDocRef = doc(FirestoreDB, COLLECTIONS.USERS, userId);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists) {
      console.log(`🟡 User document for ${userId} not found. Creating a new document...`);
      
      // ✅ Create user document before updating sign-in time
      await setDoc(userDocRef, {
        lastSignIn: serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      console.log(`✅ User document created for ${userId}`);
    } else {
      console.log(`🟢 User document found. Updating sign-in time...`);
    }

    // ✅ Now update sign-in time
    await updateDoc(userDocRef, {
      lastSignIn: serverTimestamp(),
    });

    console.log(`✅ Updated sign-in time for user: ${userId}`);
  } catch (error) {
    console.error('❌ Error updating sign-in time:', error);
    throw error;
  }
};
// ✅ Update User in Firestore (Matches Web Logic)
export const updateUserDetails = async (id, updatedUser) => {
  try {
    const userDocRef = doc(FirestoreDB, 'users', id);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists) {
      throw new Error('User does not exist.');
    }

    await updateDoc(userDocRef, updatedUser);
    console.log(`✅ User updated successfully: ${id}`);
    return { id, ...updatedUser };
  } catch (error) {
    console.error('❌ Error updating user:', error);
    throw error;
  }
};

// ✅ Delete User from Firestore and Firebase Authentication
export const deleteUser = async (id) => {
  try {
    const userDocRef = doc(FirestoreDB, 'users', id);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists) {
      throw new Error('User does not exist.');
    }

    // Delete user from Firestore
    await deleteDoc(userDocRef);
    console.log(`✅ User deleted from Firestore: ${id}`);

    // Delete user from Firebase Auth (Optional)
    const authInstance = getAuth();
    const currentUser = authInstance.currentUser;

    if (currentUser && currentUser.uid === id) {
      await firebaseDeleteUser(currentUser);
      console.log(`✅ User deleted from Firebase Auth: ${id}`);
    }

  } catch (error) {
    console.error('❌ Error deleting user:', error);
    throw error;
  }
};

// Function to update user email (requires recent authentication)
export const updateUserEmail = async (newEmail, currentPassword) => {
  try {
    const user = FirebaseAuth.currentUser;
    
    if (!user) {
      throw new Error('No authenticated user found');
    }
    
    // Re-authenticate the user first (required for sensitive operations)
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Then update the email
    await updateEmail(user, newEmail);
    
    console.log('✅ Email updated successfully to:', newEmail);
    return true;
  } catch (error) {
    console.error('❌ Error updating email:', error);
    
    // Return more specific error messages
    if (error.code === 'auth/requires-recent-login') {
      throw new Error('Please sign in again before changing your email');
    } else if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already in use by another account');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('The email address is not valid');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password');
    } else {
      throw error;
    }
  }
};

// export const getJournals = async (username) => {
//   try {
//     const querySnapshot = await getFirestore()
//       .collection(COLLECTIONS.JOURNAL)
//       .where("userId", "==", username)
//       .get();
    
//     return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//   } catch (error) {
//     console.error("Error fetching user journals:", error);
//     throw error;
//   }
// };

// export const addJournal = async (journal) => {
//   try {
//     const docRef = await getFirestore()
//       .collection(COLLECTIONS.JOURNAL)
//       .add(journal);
    
//     return { id: docRef.id, ...journal };
//   } catch (error) {
//     console.error("Error adding journal:", error);
//     throw error;
//   }
// };

// export const deleteJournal = async (id) => {
//   try {
//     await getFirestore()
//       .collection(COLLECTIONS.JOURNAL)
//       .doc(id)
//       .delete();
//   } catch (error) {
//     console.error("Error deleting journal:", error);
//     throw error;
//   }
// };

export const getParents = async () => {
  try {
    const querySnapshot = await getDocs(collection(FirestoreDB, COLLECTIONS.PARENT));

    if (querySnapshot.empty) {
      console.warn("⚠️ No parent data found.");
      return [];
    }

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Error fetching parents:", error);
    throw error;
  }
};


// ✅ Fix: Ensure correct Firestore collection reference
export const getCategories = async () => {
  try {
    const lang = await AsyncStorage.getItem('lang') || 'en';
    const categoriesRef = collection(FirestoreDB, COLLECTIONS.CATEGORY);
    const querySnapshot = await getDocs(categoriesRef);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      let name = lang === 'de' ? data.translatedNameDe || data.translated_name?.de : data.name;
      return { id: doc.id, ...data, name };
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getSubCategories = async () => {
  try {
    const lang = await AsyncStorage.getItem('lang') || 'en';
    const subCategoriesRef = collection(FirestoreDB, COLLECTIONS.SUB_CATERGORY);
    const querySnapshot = await getDocs(subCategoriesRef);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      let name = lang === 'de' ? data.translatedNameDe || data.name : data.name;
      return { id: doc.id, ...data, name };
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};

export const fetchUserData = async (username, parentId) => {
  try {
    console.log(`📢 Fetching data for username: ${username}, parent: ${parentId}`);

    const dataCollectionRef = collection(FirestoreDB, COLLECTIONS.DATA);
    const q = query(
      dataCollectionRef,
      where("username", "==", username),
      where("parent", "==", parentId) // ✅ Fix: No more `firestore().where()`
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.warn("⚠️ No data found for user:", username);
      return [];
    }

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(" Error fetching user data:", error);
    throw error;
  }
};



// export const addCategory = async (category) => {
//   try {
//     const lang = await AsyncStorage.getItem("lang") || "en";
    
//     if (!category.name) {
//       throw new Error("Category name is required.");
//     }
    
//     const docRef = await getFirestore()
//       .collection(COLLECTIONS.CATEGORY)
//       .add(category);
    
//     return {
//       id: docRef.id,
//       ...category,
//       name: lang === "de" ? category.translatedNameDe : category.name,
//     };
//   } catch (error) {
//     console.error("Error adding category:", error);
//     throw error;
//   }
// };

// export const addSubCategory = async (subCategory) => {
//   try {
//     const lang = await AsyncStorage.getItem("lang") || "en";
    
//     if (!subCategory.name || !subCategory.category) {
//       throw new Error("Subcategory name and category ID are required.");
//     }
    
//     const docRef = await getFirestore()
//       .collection(COLLECTIONS.SUB_CATERGORY)
//       .add(subCategory);
    
//     return {
//       id: docRef.id,
//       ...subCategory,
//       name: lang === "de" ? subCategory.translatedNameDe : subCategory.name,
//     };
//   } catch (error) {
//     console.error("Error adding subcategory:", error);
//     throw error;
//   }
// };

export const getTemplates = async () => {
  try {
    const lang = await AsyncStorage.getItem("lang") || "en";
    const querySnapshot = await getFirestore()
      .collection(COLLECTIONS.TEMPLATE)
      .get();
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const name = data.translated_templateName
        ? data.translated_templateName[lang]
        : data.templateName;
      return {
        id: doc.id,
        ...data,
        templateName: name,
        name: name,
      };
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
};

export const getUserTemplates = async (username) => {
  try {
    const querySnapshot = await getFirestore()
      .collection(COLLECTIONS.TEMPLATE)
      .where("users", "array-contains", username)
      .get();
    
    return querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
};

export const addTemplate = async (template) => {
  try {
    if (!template.name) {
      throw new Error("Template name is required.");
    }
    
    const docRef = await getFirestore()
      .collection(COLLECTIONS.TEMPLATE)
      .add(template);
    
    return { id: docRef.id, ...template };
  } catch (error) {
    console.error("Error adding template:", error);
    throw error;
  }
};

export const deleteTemplate = async (templateId) => {
  try {
    await getFirestore()
      .collection(COLLECTIONS.TEMPLATE)
      .doc(templateId)
      .delete();
  } catch (error) {
    console.error("Error deleting template:", error);
    throw error;
  }
};

export const updateTemplate = async (templateId, updatedTemplate) => {
  try {
    await getFirestore()
      .collection(COLLECTIONS.TEMPLATE)
      .doc(templateId)
      .update(updatedTemplate);
  } catch (error) {
    console.error("Error updating template:", error);
    throw error;
  }
};

export const updateTraningName = async (id, name) => {
  try {
    await getFirestore()
      .collection(COLLECTIONS.DATA)
      .doc(id)
      .update({ name: name });
  } catch (error) {
    console.error("Error updating name: ", error);
    throw error;
  }
};

// // =============================== Supplement Reminder ===============================

export const getSupplementReminders = async (username) => {
  try {
    const q = query(
      collection(FirestoreDB, COLLECTIONS.SUPPLEMENT_REMINDER),
      where("username", "==", username) // ✅ Fix: No more `firestore().where()`
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Error getting supplement reminder:", error);
    throw error;
  }
};

// export const addSupplementReminder = async (reminder) => {
//   try {
//     const docRef = await firestore()
//       .collection(COLLECTIONS.SUPPLEMENT_REMINDER)
//       .add(reminder);
      
//     return { id: docRef.id, ...reminder };
//   } catch (error) {
//     console.error("error adding supplement reminder", error);
//     throw error;
//   }
// };

// export const updateSupplementReminder = async (id, reminder) => {
//   try {
//     await firestore()
//       .collection(COLLECTIONS.SUPPLEMENT_REMINDER)
//       .doc(id)
//       .update(reminder);
//   } catch (error) {
//     console.error("error updating supplement reminder", error);
//     throw error;
//   }
// };

// export const deleteSupplementReminder = async (id) => {
//   try {
//     await firestore()
//       .collection(COLLECTIONS.SUPPLEMENT_REMINDER)
//       .doc(id)
//       .delete();
//   } catch (error) {
//     console.error("error deleting supplement reminder", error);
//     throw error;
//   }
// };

export const getWeightTracker = async (username) => {
  try {
    const q = query(
      collection(FirestoreDB, COLLECTIONS.WEIGHT_TRACKER),
      where("username", "==", username) // ✅ Fix: No more `firestore().where()`
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Error getting weight tracker:", error);
    throw error;
  }
};

// export const addWeightTracker = async (weight) => {
//   try {
//     const docRef = await firestore()
//       .collection(COLLECTIONS.WEIGHT_TRACKER)
//       .add(weight);
      
//     const docSnapshot = await getFirestore()
//       .collection(COLLECTIONS.WEIGHT_TRACKER)
//       .doc(docRef.id)
//       .get();
      
//     return { id: docRef.id, ...docSnapshot.data() };
//   } catch (error) {
//     console.error("error adding weight tracker", error);
//     throw error;
//   }
// };

// export const deleteWeightTracker = async (id) => {
//   try {
//     await getFirestore()
//       .collection(COLLECTIONS.WEIGHT_TRACKER)
//       .doc(id)
//       .delete();
//   } catch (error) {
//     console.error("error deleting weight tracker", error);
//     throw error;
//   }
// };

