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
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

  // $(window).on('scroll', function(){
  //   if($(window).scrollTop()>=95 && !$('nav').hasClass('fixed')){
  //       $('nav').addClass('fixed'); 
  //   }
  //   else if($(window).scrollTop()<95 && $('nav').hasClass('fixed')){
  //      $('nav').removeClass('fixed') 
  //   }
// });
  











































































//adds dropdown for the account membership

$( document ).ready(function(){
  console.log("ready")
  $(".dropdown-trigger").dropdown();
})
  






  