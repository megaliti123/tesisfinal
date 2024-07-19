// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBh0ZO3bO7If5YSwzLHdeG9WyJ6f3knNoI",
  authDomain: "tesis2-44654.firebaseapp.com",
  projectId: "tesis2-44654",
  storageBucket: "tesis2-44654.appspot.com",
  messagingSenderId: "626069717167",
  appId: "1:626069717167:web:ea99312208670fcba0d45a"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase