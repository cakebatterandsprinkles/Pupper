

// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAcONzsJOrUW2xJRf1LVc0QUJoRFdiK0xM",
    authDomain: "pupper-80829.firebaseapp.com",
    databaseURL: "https://pupper-80829.firebaseio.com",
    projectId: "pupper-80829",
    storageBucket: "",
    messagingSenderId: "164074437731",
    appId: "1:164074437731:web:e8c78364f54f9a84"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// putting our database in a variable
database = firebase.database();