const firebaseConfig = {
    apiKey: "AIzaSyDoNc9nRnC7D25AjRtWMvrIdRZ633l3Mbc",
    authDomain: "pop-a-balloon-game-608d7.firebaseapp.com",
    projectId: "pop-a-balloon-game-608d7",
    storageBucket: "pop-a-balloon-game-608d7.appspot.com",
    messagingSenderId: "280232484887",
    appId: "1:280232484887:web:bcd2aaf67eeadc49d87c52",
    measurementId: "G-D7M9503PQE"
  };

    // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const firestore = firebase.firestore();