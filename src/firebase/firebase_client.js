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

    // 🔥 Query Firestore: Find user where `authId` matches UID
    const usersCollectionRef = collection(getFirestore(), "users");
    const q = query(usersCollectionRef, where("authId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn("⚠️ No user data found for UID:", userId);
      return null;
    }

    // ✅ Extract user document data
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    console.log("✅ Firestore User Data:", userData);

    return { id: userDoc.id, ...userData };
  } catch (error) {
    console.error("❌ Firestore Error:", error);
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

