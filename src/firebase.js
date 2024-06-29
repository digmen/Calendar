import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAQCKnwwQC38HgcJN4zsKrrBBy8R4GEF88",
    authDomain: "calendar-68ea6.firebaseapp.com",
    projectId: "calendar-68ea6",
    storageBucket: "calendar-68ea6.appspot.com",
    messagingSenderId: "773938841234",
    appId: "1:773938841234:web:603406b148ae648b55c84b",
    measurementId: "G-SZ4QLLF16E"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }