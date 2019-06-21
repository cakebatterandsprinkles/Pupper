let prevArrow = '<i class="fas fa-chevron-left"></i>';
let nextArrow = '<i class="fas fa-chevron-right"></i>';

let favoritesList = [];
let userVideos = [];
let playlist = [];

$(document).ready(function () {
    //creates a form on account and login
    $(".modal").modal();

    // adds dropdown for the account membership
    $(".dropdown-trigger").dropdown();
    //creates mobile menu
    $(".sidenav").sidenav();
    // makes carousel functional

    $(".slick-carousel").slick({
        arrows: false
    });

    let name = localStorage.getItem("name");
    let petname = localStorage.getItem("petname");
    let pettype = localStorage.getItem("pettype");

    if (name !== null) {
        $("#main-header").html('<h1>Hello ' + name + ' & ' + petname + '!</h1>');
        $("#slogan").html("Welcome to your personalized Pet TV!");

        let gifUrl = localStorage.getItem("petgif");

        if (gifUrl !== null) {
            $("#card-image").empty();
            let gif = $("<img>")
                .attr("src", gifUrl)
                .addClass("responsive-image circle");
            $("#card-image").append(gif);
        } else {
            getPetGif(pettype);
        }
    }

    $(".favorite-button").on("click", function () {
        const currentVideoUrl = $(".slick-current iframe").attr("src");

        if (favoritesList.indexOf(currentVideoUrl) == -1) {

            favoritesList.push(currentVideoUrl);

            database.ref("favorites/").set(favoritesList);

            showFavorites();
        }
    });

    $(".user-video-button").on("click", function () {
        const currentVideoUrl = $(".slick-current iframe").attr("src");
    
        if (userVideos.indexOf(currentVideoUrl) == -1) {
    
            userVideos.push(currentVideoUrl);
    
            database.ref("userVideos/").set(userVideos);
        
            showUserVideos();
        }
     
    });

    database.ref("favorites/").on("value", function (snapshot) {
        if (snapshot.val() !== null) {
            favoritesList = snapshot.val();
            showFavorites();
        }
    });

    database.ref("userVideos/").on("value", function (snapshot) {
        if (snapshot.val() !== null) {
            userVideos = snapshot.val();
            showUserVideos();
        }
    });
    
    database.ref("playlist/").on("value", function (snapshot) {
        if (snapshot.val() !== null) {
            playlist = snapshot.val();
            showPlaylist();
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
        ev.preventDefault();

        let searchTerm = $("#search").val();

        $(".slick-carousel").slick("unslick");
        $(".slick-carousel").empty();
        $("#search").val("");

        $.get("https://content.googleapis.com/youtube/v3/search?maxResults=25&part=snippet&q=" + searchTerm + "&type=video&key=AIzaSyBzAxY1nCJJ8ViZ9WXy4uJPnRGrudkJnrc")
            .then(function (response) {

                    response.items.forEach(function (item) {
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

    $("#submit-info").on("click", function (event) {
        event.preventDefault();

        var name = $("#name-input").val().trim();
        var petname = $("#petname-input").val().trim();
        var pettype = $("#pettype-input").val().trim();

        if (name.length === 0 || petname.length === 0 || pettype === 0) {
            return;
        }

        $("#main-header").html('<h1>Hello ' + name + ' & ' + petname + '!</h1>');
        $("#slogan").html("Welcome to your personalized Pet TV!");

        localStorage.clear();

        localStorage.setItem("name", name);
        localStorage.setItem("petname", petname);
        localStorage.setItem("pettype", pettype);

        $('.modal').modal('close');

        getPetGif(pettype);

    });
});

function getPetGif(pettype) {
    let queryUrl = "https://api.giphy.com/v1/gifs/search?q=" +
        pettype.toLowerCase() +
        "&api_key=rD1UAc0GsPoRiL1JMVl6T3mJGQdJ3SYU&limit=5";

    $.get(queryUrl).then(function (data) {

        $("#card-image").empty();
        let url = data.data[0].images.original.url;
        let gif = $("<img>")
            .attr("src", url)
            .addClass("responsive-image circle");

        $("#card-image").append(gif);

        localStorage.setItem("petgif", url);
    });

}

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

            let playlistButton = $("<button>")
                .addClass("playlist-button waves-effect waves-light btn-sm")
                .html('<i class="fas fa-play-circle"></i> Add to playlist')
                .on("click", function () {
                    removeFavorite(item);
                    addPlaylist(item);
                });

            let thumbnail = $("<div>").addClass("thumbnail").append(iframe).append(removeButton).append(playlistButton);
            $("#favorite-videos").append(thumbnail);
        });
    }
}

function showPlaylist() {
    $("#playlist-videos").empty();

    if (playlist.length > 0) {

        let urlArray = [];

        for (let i = 1; i < playlist.length; i++) {
            urlArray.push(playlist[i].replace("https://www.youtube.com/embed/", ""));
        }

        var urlList = urlArray.join(',');

        let iframe = $("<iframe>")
            .attr("width", "640")
            .attr("height", "360")
            .attr("src", playlist[0] + "?enablejsapi=1&autoplay=1&playlist=" + urlList)
            .attr("frameborder", "0")
            .attr("allowfullscreen", "true");

        let removeButton = $("<button>")
            .addClass("remove-button waves-effect waves-light btn-sm")
            .html('<i class="fas fa-undo"></i> Reset Playlist')
            .on("click", function () {
                resetPlaylist();
            });

        $("#playlist-videos").append(iframe);
        $("#playlist-videos").append(removeButton);
    }
}

function removeFavorite(url) {

    if (favoritesList !== null) {
        favoritesList = favoritesList.filter(function (item) {
            return item !== url;
        });

        database.ref("favorites/").set(favoritesList);
    }
    showFavorites();
}

function showUserVideos() {
$("#user-vids").empty();

if (userVideos !== null) {
    userVideos.forEach(function (item) {
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
                removeUserVideo(item);
            });
        
        let playlistButton = $("<button>")
        .addClass("playlist-button waves-effect waves-light btn-sm")
        .html('<i class="fas fa-play-circle"></i> Add to playlist')
        .on("click", function () {
            removeUserVideo(item);
            addPlaylist(item);
        });

        let thumbnail = $("<div>").addClass("thumbnail").append(iframe).append(removeButton).append(playlistButton);
        $("#user-vids").append(thumbnail);
    });
}
}

function removeUserVideo(url) {

    if (userVideos !== null) {
        userVideos = userVideos.filter(function (item) {
            return item !== url;
        });

        database.ref("userVideos/").set(userVideos);
    }

    showUserVideos();
}

function addPlaylist(url) {
    playlist.push(url);
    database.ref("playlist/").set(playlist);
    showPlaylist();
}

function resetPlaylist() {
    playlist = [];
    database.ref("playlist/").set(playlist);
    showPlaylist();
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


var feedback = database.ref("/feedback");

//creation of reference that holds users and their passwords
var storage = firebase.storage();


// create a storage reference from the storage service
var userRef = storage.ref();

//   create a child reference to hold user login info
var loginRef = userRef.child('User Login Info');


// create a child reference to hold user preferences such as videos, images, ect...
var userPreferencesRef = userRef.child('User Preferences');


// create a child reference for userPreferencesRef that will hold the videos
var videos = userPreferencesRef.child('Videos');


// create a child reference for the videos reference that holds user made videos
var userMade = videos.child('User Made');


// create a child reference for the videos reference that holds user favorite videos
var favorites = videos.child('Favorites');
