$(document).ready(function () {
    console.log("ready");
    // adds dropdown for the account membership
    $(".dropdown-trigger").dropdown();
    // makes carousel functional
    gapi.load("client:youtube", function () {
        gapi.client.setApiKey("AIzaSyBzAxY1nCJJ8ViZ9WXy4uJPnRGrudkJnrc");
        gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest");
    });

    $(".slick-carousel").slick({
        autoplay: true
    });


    $("#search-bar").on("submit", function (ev) {
        ev.preventDefault();

        let searchTerm = $("#search").val();

        $(".slick-carousel").slick("unslick");
        $(".slick-carousel").empty();

        gapi.client.youtube.search.list({
                "part": "snippet",
                "maxResults": 5,
                "q": searchTerm
            })
            .then(function (response) {
                    console.log("Response", response);


                    response.result.items.forEach(function (item) {
                        console.log(item);
                        let videoId = item.id.videoId;
                        let iframe = $("<iframe>").attr("width", "560").attr("height", "315").attr("src", "https://www.youtube.com/embed/" + videoId)
                        .attr("allowfullscreen", "true");
                        let video = $("<div>").addClass("video").append(iframe);
                        $(".slick-carousel").append(video);
                    });

                    $(".slick-carousel").slick({
                        autoplay: true
                    });
                

                },
                function (err) {
                    console.error("Execute error", err);
                });

        return false;
    });
});


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
$("#login-new-btn").on("click", function (event) {

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
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
            // Handle errors here
            var errorCode = error.code;
            var errorMessage = error.message;

            // TODO: Dynamic insertion into html when error occurs to warn user
            console.log(errorCode);
            console.log(errorMessage);
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

// button to sign in existing users
$("#login-returning-btn").on("click", function (event) {

    event.preventDefault();

    // setting variables for the returning user inputs
    email = $("#returning-email-input").val().trim();
    pass = $("#returning-password-input").val().trim();

    // declaring var for user auth method
    const auth = firebase.auth();

    // promise that runs the authorization
    auth.SignInWithEmailAndPassword(email, pass).catch(function (error) {

        // handle errors in authentication
        errorCode = error.code;
        errorMessage = error.message;

        // console log for now but needs to be dynamically inserted into html form
        console.log(errorCode);
        console.log(errorMessage);
    })
})