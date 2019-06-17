  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAcONzsJOrUW2xJRf1LVc0QUJoRFdiK0xM",
    authDomain: "pupper-80829.firebaseapp.com",
    databaseURL: "https://pupper-80829.firebaseio.com",
    projectId: "pupper-80829",
    storageBucket: "",
    messagingSenderId: "164074437731",
    appId: "1:164074437731:web:e8c78364f54f9a84"
  };
  // Initializegit  Firebase
  firebase.initializeApp(firebaseConfig);

//   declaration of firebase 
  var database = firebase.database();
  console.log(database);

//   creating directives for the submit button for members
$("#add-new-user-btn").on("click"), function(event) {

    // prevent page reload upon form submission
    event.preventDefault();

    // emptied values for new user sign-up
    newName= $("#new-user-input").val().trim();

    newEmail = $("#new-email-input").val().trim();

    newPassword = $("#new-password-input").val().trim();

    newConfirmPassword = $("#new-confirm-password-input").val().trim();

    // local "temporary" object for holding values
    var newUser = {
        name: newName,
        email: newEmail,
        password: newPassword,
        passwordConfirm: newConfirmPassword,

    };

    // This puts the user inputs into the database
    database.ref().push(newUser);
    
    // testing the database
    console.log(newUser.name);

}

    
    
        

