// Kristian Suhartono

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var config = {
  apiKey: "AIzaSyD-beQYtXL5ns5029cYcBcKi423xucOkCA",
  authDomain: "ielmocrdatabase.firebaseapp.com",
  databaseURL: "https://ielmocrdatabase.firebaseio.com",
  projectId: "ielmocrdatabase",
  storageBucket: "ielmocrdatabase.appspot.com",
  messagingSenderId: "109715088531"
};
firebase.initializeApp(config);

var fb = firebase.database().ref();
var fbAuth = firebase.auth();

var imageApp = angular.module("starter", ["ionic", "ngCordova", "firebase"]);

var userData = null;


imageApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

imageApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("firebase", {
      url: "/firebase",
      templateUrl: "templates/firebase.html",
      controller: "FirebaseController",
      cache: false
    })
    .state("secure", {
      url: "/secure",
      templateUrl: "templates/secure.html",
      controller: "SecureController"
    });
  $urlRouterProvider.otherwise('/firebase');
});

imageApp.controller("FirebaseController", function($scope, $state, $firebaseAuth) {

  $scope.login = function(username, password) {
    fbAuth.signInWithEmailAndPassword(username, password).then(function(result) {
      alert("Login succesful");
      $state.go("secure")
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("User login failed, reason: " + errorMessage);
      console.error("ERROR: " + errorCode + " | Message: " + errorMessage);
    });
  };



  $scope.register = function(username, password) {
    fbAuth.createUserWithEmailAndPassword(username, password).then(function(result) {
      alert("User creation successful");
      $state.go("secure")
    }).catch(function(error) {
      // Handle Errors here.
      alert("User creation failed");
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error("ERROR: " + errorCode + " | Message: " + errorMessage);
    });
  };

});

imageApp.controller("SecureController", function($scope, $state, $ionicHistory, $firebaseArray, $cordovaCamera) {

  $ionicHistory.clearHistory();

  $scope.images = [];

  $scope.myVar = 1;

  var imagesRef = firebase.database().ref('images');

  var syncArray = $firebaseArray(imagesRef);
  syncArray.$loaded().then(function(x) {
    console.log("Success");
  }).catch(function(error) {
    console.error("Error:", error);
  });
  $scope.images = syncArray;

  $scope.upload = function() {
    var options = {
      quality : 75,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
      syncArray.$add({image: imageData}).then(function() {
        alert("Image has been uploaded");
      });
    }, function(error) {
      console.error(error);
    });
  }

  $scope.logout = function() {
    firebase.auth().signOut().then(function(result) {
      alert("Logged out");
      $state.go("firebase")
    }).catch(function(error) {
      // Handle Errors here.
      alert("Log out failed");
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error("ERROR: " + errorCode + " | Message: " + errorMessage);
    })
  }
});
