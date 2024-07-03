import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAQCKnwwQC38HgcJN4zsKrrBBy8R4GEF88",
    authDomain: "calendar-68ea6.firebaseapp.com",
    projectId: "calendar-68ea6",
    storageBucket: "calendar-68ea6.appspot.com",
    messagingSenderId: "773938841234",
    appId: "1:773938841234:web:603406b148ae648b55c84b",
    measurementId: "G-SZ4QLLF16E",
    databaseURL: "https://calendar-68ea6-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Get Firestore instance
const realtimeDb = getDatabase(app); // Get Realtime Database instance

export { db, realtimeDb };