// Importing function needed fore initialization of firebase and firestore
const {initializeApp} = require("firebase/app");
require("firebase/auth");
require("firebase/database");
const {getFirestore, collection} = require("firebase/firestore");

// Initialization script for firebase
const firebaseConfig = {
    apiKey: "AIzaSyBGw6hgcHuOoCMAZjiue4cO0NeAZPko2Q0",
    authDomain: "tanui-api-c3a74.firebaseapp.com",
    projectId: "tanui-api-c3a74",
    storageBucket: "tanui-api-c3a74.appspot.com",
    messagingSenderId: "363181557889",
    appId: "1:363181557889:web:1549f9c7776bbadf1aa580",
    measurementId: "G-404RGDZ93Q"
  };

  const fireBase = initializeApp(firebaseConfig); // Initializing firebase
  const db = getFirestore(fireBase); // Initializing the firestore database
  const Item = collection(db, "items");// Establishing a collection within the database

  module.exports = {Item}; //Exporting the colection to rest.js
  