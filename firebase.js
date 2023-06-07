// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCcX1NJq77uFwEhkZnT9HsaqyyFkTDb_NQ",
    authDomain: "jss-students-32471.firebaseapp.com",
    projectId: "jss-students-32471",
    storageBucket: "jss-students-32471.appspot.com",
    messagingSenderId: "921747773044",
    appId: "1:921747773044:web:a3affef9a2de9e1455a321"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize database
const db = getFirestore(app);

export {
    db
}