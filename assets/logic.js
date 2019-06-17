// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAcONzsJOrUW2xJRf1LVc0QUJoRFdiK0xM",
    authDomain: "pupper-80829.firebaseapp.com",
    databaseURL: "https://pupper-80829.firebaseio.com",
    projectId: "pupper-80829",
    storageBucket: "pupper-80829.firebaseapp.com",
    messagingSenderId: "164074437731",
    appId: "1:164074437731:web:e8c78364f54f9a84"
};

// Initializegit  Firebase
firebase.initializeApp(firebaseConfig);

// declaration of firebase 
var database = firebase.database();
console.log(database);

//creation of reference that holds users and their passwords
var storage = firebase.storage();

// create a storage reference from the storage service
var userRef = storage.ref();

//   create a child reference to hold user login info
var loginRef = userRef.child('User Login Info');

// create a child reference to hold user preferences such as videos, images, ect...
var userPreferencesRef = userRef.child('User Preferences');


//   creating directives for the submit button for members
$("#sign-up-btn").on("click", function (event) {
  
});
  













































































$( document ).ready(function(){
  console.log("ready")
  //adds dropdown for the account membership
  $(".dropdown-trigger").dropdown();
  //makes carousel functional
  $('.carousel').carousel();
});
  
  //   creating directives for the submit button for members
  $("#add-new-user-btn").on("click", function(event) {

    // prevent page reload upon form submission
    event.preventDefault();

    // emptied values for new user sign-up
    name = $("#new-user-input").val().trim();

    email = $("#new-email-input").val().trim();

    password = $("#new-password-input").val().trim();

    confirmPassword = $("#new-confirm-password-input").val().trim();

    // add password confirmation with else/if

    if (password == confirmPassword) {

        //local "temporary" object for holding values
        var newUser = {

            name: name,
            email: email,
            password: password,
        
        };

        // push the confirmed user into a login storage and into the database
        database.ref().push(newUser);
        loginRef.push(newUser);

        // console.log the pushed new user object
        console.log(newUser.name);
        console.log(newUser.email);
        console.log(newUser.password);

        // create user with email and password
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle errors here
            var errorCode = error.code;
            var errorMessage = error.message;
        });

        // clear out input forms
        $("#new-name-input").val("");
        $("#new-email-input").val("");
        $("#new-password-input").val("");
        $("#new-password-confirm-input").val("");

        // TODO: create div for modal that will welcome the new user into the page and show all the different things they can do as members
        

        
    } 
    // if the password does not match the confirm password input then then we should show the user a text that says that passwords did not match
    else {
        // text as a variable
        passwordError = $("<div>");
        passwordError.addClass(".passwords-dont-match");
        passwordError.text("That's ruff, your passwords don't match!");

        // clear out input forms for password
        $("#new-password-input").val("");
        $("#new-password-confirm-input").val("");
    }

    // This puts the user inputs into the database
    database.ref().push(newUser);
    
    // testing the database
    console.log(newUser.name);
  });

