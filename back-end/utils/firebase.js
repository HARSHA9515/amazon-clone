// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrIIJgfLkDUQsuaPzKR8jStqTpFve80Ww",
  authDomain: "angular-ecommerce-ac49d.firebaseapp.com",
  projectId: "angular-ecommerce-ac49d",
  storageBucket: "angular-ecommerce-ac49d.appspot.com",
  messagingSenderId: "352934021334",
  appId: "1:352934021334:web:0e953c338792e848bf2177",
  measurementId: "G-PL1LEYJY8Y"
};

// Initialize Firebase
const firebase = firebase.initializeApp(firebaseConfig);
module.exports = { firebase }; //export the app
