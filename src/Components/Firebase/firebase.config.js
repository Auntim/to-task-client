// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-gt1XF9oUy4_qlQiZkCAzmUP-_cb493A",
    authDomain: "laywer-service.firebaseapp.com",
    projectId: "laywer-service",
    storageBucket: "laywer-service.firebasestorage.app",
    messagingSenderId: "79708776188",
    appId: "1:79708776188:web:e5cf8e8526047a5abd9979"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;