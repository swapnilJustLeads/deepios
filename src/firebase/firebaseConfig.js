import { FirebaseApp, initializeApp } from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

// ✅ Initialize Firebase (React Native uses auto-linking, no manual config needed)
export const FirestoreDB = firestore();
export const FirebaseStorage = storage();
export const FirebaseAuth = auth();
