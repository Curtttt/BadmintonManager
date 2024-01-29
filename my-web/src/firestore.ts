import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDNTX77oV6FaXShPz_h74o1VBqsv7KO5AI",
    authDomain: "badminton-f9a3f.firebaseapp.com",
    projectId: "badminton-f9a3f",
    storageBucket: "badminton-f9a3f.appspot.com",
    messagingSenderId: "620862202534",
    appId: "1:620862202534:web:13a049c00e68b54bf70a67",
    measurementId: "G-JD7RJLHY0L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
