// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyA9BeYkQugSLtDd6l-lIuaDab5YL0zExNI",

  authDomain: "fir-app-2e318.firebaseapp.com",

  projectId: "fir-app-2e318",

  storageBucket: "fir-app-2e318.firebasestorage.app",

  messagingSenderId: "1049372509404",

  appId: "1:1049372509404:web:29487ca7b97e0b3af6a019",

  measurementId: "G-TL2W8WZLFE"

};


// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();
export { auth };
