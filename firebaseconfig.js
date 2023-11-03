import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAA6MCh2LiMEKKDQFHe7y22aCGQlU0wXUs",
    authDomain: "onsenmatching.firebaseapp.com",
    projectId: "onsenmatching",
    storageBucket: "onsenmatching.appspot.com",
    messagingSenderId: "573304168468",
    appId: "1:573304168468:web:85f8c5414fed5d34f78701",
    measurementId: "G-XSC4P6WG6P"
  };

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
