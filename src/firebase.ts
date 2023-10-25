// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB4reYFn9fZI2QetciSyjDtCtUywi5f5Ic',
  authDomain: 'twitter-8f47f.firebaseapp.com',
  projectId: 'twitter-8f47f',
  storageBucket: 'twitter-8f47f.appspot.com',
  messagingSenderId: '619418272674',
  appId: '1:619418272674:web:2bf68647e367c2a90aa8fb',
};

// Initialize Firebase

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
