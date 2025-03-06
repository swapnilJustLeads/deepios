import { 
  getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc, serverTimestamp,
} from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@react-native-firebase/storage';
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

// ✅ Add new user (Updated)
export const addUser = async (user) => {
  try {
    if (!user.username || !user.email) {
      throw new Error('All fields are required.');
    }

    const userDocRef = doc(FirestoreDB, COLLECTIONS.USERS, user.username);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
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
    const storageRef = ref(FirebaseStorage, `profile_pictures/${username}`);
    const response = await fetch(fileUri);
    const blob = await response.blob();
    
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading profile picture:', error);
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
