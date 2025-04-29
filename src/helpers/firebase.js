// // src/firebase.js
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: "AIzaSyD3a8VkywtCc5CoZtXFmOeyq75yrsmOyxE",
//   authDomain: "tressa-ecommerce.firebaseapp.com",
//   projectId: "tressa-ecommerce",
//   storageBucket: "tressa-ecommerce.appspot.com",
//   messagingSenderId: "457060499012",
//   appId: "1:457060499012:web:fc32da0fec740083c4c611",
//   measurementId: "G-E9CENZ5C6J",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore(app);

// export { db };

// src/helpers/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyD3a8VkywtCc5CoZtXFmOeyq75yrsmOyxE",
  authDomain: "tressa-ecommerce.firebaseapp.com",
  projectId: "tressa-ecommerce",
  storageBucket: "tressa-ecommerce.appspot.com",
  messagingSenderId: "457060499012",
  appId: "1:457060499012:web:fc32da0fec740083c4c611",
  measurementId: "G-E9CENZ5C6J",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


export { app, auth, db };

