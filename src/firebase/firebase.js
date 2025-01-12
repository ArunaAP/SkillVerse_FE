// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDn1ELQR9KQ0evLOZ8BN8eGeuIK2njQ-2A",
  authDomain: "skillverse-project.firebaseapp.com",
  projectId: "skillverse-project",
  storageBucket: "skillverse-project.appspot.com", // Corrected storageBucket URL
  messagingSenderId: "972582145442",
  appId: "1:972582145442:web:6df5f33f980417d428b6fb",
  measurementId: "G-50RCVBQ3KR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { storage, analytics, app };
