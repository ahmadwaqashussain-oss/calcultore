import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration
// You can use these demo credentials or replace with your own
// To get your own Firebase config:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Go to Project Settings > General
// 4. Scroll down to "Your apps" and click "Web app"
// 5. Copy the firebaseConfig object

const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForCalculatorApp123456789",
  authDomain: "calculator-app-demo.firebaseapp.com",
  databaseURL: "https://calculator-app-demo-default-rtdb.firebaseio.com",
  projectId: "calculator-app-demo",
  storageBucket: "calculator-app-demo.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Initialize Firebase
let app;
let database;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Fallback to localStorage if Firebase fails
  database = null;
}

export { database };
