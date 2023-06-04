// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCzhLFW-t1xp8z_yeUwMLQiz4EH2k9-2ng",
    authDomain: "jss-students-9aeb9.firebaseapp.com",
    projectId: "jss-students-9aeb9",
    storageBucket: "jss-students-9aeb9.appspot.com",
    messagingSenderId: "898600283079",
    appId: "1:898600283079:web:1ca532aa561622a67ac7e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize database
const db = getFirestore(app);

export {
    db
}