import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveUserData(walletAddress, data) {
  if (!walletAddress) return false;
  
  try {
    const userRef = doc(db, 'users', walletAddress.toLowerCase());
    await setDoc(userRef, {
      ...data,
      walletAddress: walletAddress.toLowerCase(),
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    console.log('Data saved to cloud');
    return true;
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    return false;
  }
}

export async function loadUserData(walletAddress) {
  if (!walletAddress) return null;
  
  try {
    const userRef = doc(db, 'users', walletAddress.toLowerCase());
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      console.log('Data loaded from cloud');
      return docSnap.data();
    } else {
      console.log('No cloud data found for this wallet');
      return null;
    }
  } catch (error) {
    console.error('Error loading from Firestore:', error);
    return null;
  }
}

export { db };
