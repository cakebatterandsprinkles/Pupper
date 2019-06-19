let prevArrow = '<i class="fas fa-chevron-left"></i>';
let nextArrow = '<i class="fas fa-chevron-right"></i>';

const userId = 'test';

let favoritesList = [];

$(document).ready(function () {
    $(".modal").modal();
    console.log("ready");

    // adds dropdown for the account membership
    $(".dropdown-trigger").dropdown();
    $(".sidenav").sidenav();
    // makes carousel functional

    $(".slick-carousel").slick({
        arrows: false
    });

    $(".favorite-button").on("click", function () {
        const currentVideoUrl = $(".slick-current iframe").attr("src");

        favoritesList.push(currentVideoUrl);

        database.ref("favorites/" + userId).set(favoritesList);

        showFavorites();
    });

    database.ref("favorites/" + userId).on("value", function (snapshot) {
        if (snapshot.val() !== null) {
            favoritesList = snapshot.val();
            showFavorites();
        }
    });

    $("#form-submit-button").on("click", function () {
        const firstName = $("#first_name").val().trim();
        const lastName = $("#last_name").val().trim();
        const email = $("#form_email").val().trim();
        const text = $("#textarea1").val().trim();

        const newFeedback = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            text: text
        };

        feedback.push(newFeedback);

        alert("Your feedback has been received.");

        $("#first_name").val("");
        $("#last_name").val("");
        $("#form_email").val("");
        $("#textarea1").val("");

    });


    $("#search-bar").on("submit", function (ev) {
        console.log(ev);
        ev.preventDefault();

        let searchTerm = $("#search").val();
        console.log(searchTerm);

        $(".slick-carousel").slick("unslick");
        $(".slick-carousel").empty();

        $.get("https://content.googleapis.com/youtube/v3/search?maxResults=25&part=snippet&q=" + searchTerm + "&type=video&key=AIzaSyBzAxY1nCJJ8ViZ9WXy4uJPnRGrudkJnrc")
            .then(function (response) {
                    console.log("Response", response);

                    response.items.forEach(function (item) {
                        console.log(item);
                        let videoId = item.id.videoId;
                        let iframe = $("<iframe>").attr("width", "560").attr("height", "315").attr("src", "https://www.youtube.com/embed/" + videoId)
                            .attr("frameborder", "0")
                            .attr("allowfullscreen", "true");
                        let video = $("<div>").addClass("video").append(iframe);
                        $(".slick-carousel").append(video);
                    });

                    $(".slick-carousel").slick({
                        arrows: true,
                        prevArrow: prevArrow,
                        nextArrow: nextArrow
                    });
                },
                function (err) {
                    console.error("Execute error", err);
                });
        return false;
    });
});

function showFavorites() {
    $("#favorite-videos").empty();

    if (favoritesList !== null) {
        favoritesList.forEach(function (item) {
            let iframe = $("<iframe>")
                .attr("width", "320")
                .attr("height", "180")
                .attr("src", item)
                .attr("frameborder", "0")
                .attr("allowfullscreen", "true");

            let removeButton = $("<button>")
                .addClass("remove-button waves-effect waves-light btn-sm")
                .html('<i class="fas fa-trash"></i> Remove')
                .on("click", function () {
                    removeFavorite(item);
                });

            let thumbnail = $("<div>").addClass("thumbnail").append(iframe).append(removeButton);
            $("#favorite-videos").append(thumbnail);
        });
    }
}

function removeFavorite(url) {

    if (favoritesList !== null) {
        favoritesList = favoritesList.filter(function (item) {
            return item !== url;
        });

        database.ref("favorites/" + userId).set(favoritesList);
    }

    showFavorites();
}




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

var feedback = database.ref("/feedback");

//creation of reference that holds users and their passwords
var storage = firebase.storage();
console.log(storage);

// create a storage reference from the storage service
var userRef = storage.ref();

//   create a child reference to hold user login info
var loginRef = userRef.child('User Login Info');
console.log(loginRef);

// create a child reference to hold user preferences such as videos, images, ect...
var userPreferencesRef = userRef.child('User Preferences');
console.log(userPreferencesRef);

// create a child reference for userPreferencesRef that will hold the videos
var videos = userPreferencesRef.child('Videos');
console.log(videos);

// create a child reference for the videos reference that holds user made videos
var userMade = videos.child('User Made');
console.log(userMade);

// create a child reference for the videos reference that holds user favorite videos
var favorites = videos.child('Favorites');
console.log(favorites);





//   creating directives for the submit button for members
$("#login-new-btn").on("click", function (event) {

    // prevent page reload upon form submission
    event.preventDefault();

    // emptied values for new user sign-up
    name = $("#username").val().trim();

    email = $("#email").val().trim();

    password = $("#password-confirm-input").val().trim();

    confirmPassword = $("#returning-password-input").val().trim();

    // PET NAME AND PET TYPE FROM CHECK BOX NEED TO BE ADDED

    // now adding a function to ensure the user is adding a real email
    function IsEmail(email) {
        var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!regex.test(email)) {
            return false;
        } else {
            return true;
        }
    };

    if (IsEmail(email) == false) {
        $("#invalid_email").show();
        return false;
    };



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

// Function that will hide the password with toggle
$("#show-password").on("click", function (event) {

    // prevent page refresh upon form submission
    event.preventDefault();

    function showPassword() {
        // set the variable hooking the password class
        let hiddenPassword = $(".password").val().trim();

        // if else statement causing the visibility toggle
        if (hiddenPassword.type === "password") {
            hiddenPassword.type = "text";
        } else {
            hiddenPassword.type = "password";
        }

    };

    showPassword();

    // test to make sure hiddenPassword is grabbing the right input
    console.log(hiddenPassword);

});

// --------------------------------------------------------Video API---------------------------------------------------------------------------------

// This API requires constant authorization through tokens so first I have to create authentication settings


const apiVideo = require('@api.video/nodejs-sdk');

myUserName = "m.villarreal789@hotmail.com";

myAPIkey = "jwVeUs2YDYIjBK0Y9vDQjF4Z6DjJSFS9s4N6oTc3fCz";

// create client and authenticate
const client =  new apiVideo.Client({username:myUserName, apiKey: myAPIkey});

// here we'll create the video upload event
$("#user-upload-video").on('click',function(event) {

    // prevent page refresh on form submission
    event.preventDefault();

    // set variables that tie to inputs
    userVideoTitle = $("#video-user-title").val().trim();
    userVideoFile = $("#video-user-file").val().trim();

    // temporary object to hold value
    userNewVideoStored = {
        title: userVideoTitle,
        video: userUploadVideo
    };

    // push the object into the firebase storage
    userMade.push(userNewVideoStored);


    // upload from the file into the firebase storage
    var uploadTask = userMade.child(userVideoTitle).put(file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', function(snapshot){
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
    }, function(error) {
    // Handle unsuccessful uploads
    }, function() {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
    });
    });

    // check the object
    console.log(userNewVideoStored.title);
    console.log(userNewVideoStored.video);


    // create and upload a video resource
    let userUploadVideo = client.videos.upload(userVideoFile, {title: userVideoTitle});

    // check to see if the video uploaded with the correct title
    userUploadVideo.then(function(video) {
        console.log(video.title);
    }).catch(function(error) {
        console.error(error);
    });

    // Upload a video thumbnail
    let userUploadThumbnail = client.videos.uploadThumbnail('images/pupper.png', userVideoTitle);

    userUploadThumbnail.then(function(video) {
        console.log(video.title);
    })

    // update video thumbnail by picking image with video timecode
    let userUpdateThumbnail = client.videos.updateThumbnailWithTimecode(userVideoTitle, '00:05:22.05');

    userUpdateThumbnail.then(function(video) {
        console.log(video.title);
    });


});










// ---------------------------------------------------------------------------------------------------------------------------------------------------







