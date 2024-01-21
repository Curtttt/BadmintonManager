// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);