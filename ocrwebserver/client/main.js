import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

import * as firebase from "firebase";

var config = {
    apiKey: "AIzaSyD-beQYtXL5ns5029cYcBcKi423xucOkCA",
    authDomain: "ielmocrdatabase.firebaseapp.com",
    databaseURL: "https://ielmocrdatabase.firebaseio.com",
    projectId: "ielmocrdatabase",
    storageBucket: "ielmocrdatabase.appspot.com",
    messagingSenderId: "109715088531"
};
var webApp = firebase.initializeApp(config);
var fbAuth = firebase.auth();
var fbDatabase = firebase.database().ref();
var fbImages = fbDatabase.child('images');

Template.home.onCreated(() => {
    Meteor.subscribe("imageTimestamps.all");
});

Template.home.onRendered(() => {
    fbImages.on('child_added', function(snapshot) {
        let image = new Image();
        image.src = 'data:image/jpg;base64,' + snapshot.val().image;
        // document.body.appendChild(image);
        //Create an object to download
        let downloadImg = image;
        downloadImg.src.replace('image/jpg', 'image/octet-stream');
        //Download the file
        let link = document.createElement('a');
        let filename = new Date();
        link.download = filename.getTime();
        link.href = downloadImg.src;
        link.click();
        Meteor.call('imageTimestamps.insert', filename.getTime());
    });
});

Template.home.helpers({
    imageTimestamps: () => {
        return ImageTimestamps.find().fetch();
    }
});
