import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {Session} from 'meteor/session'
// import {Papa} from 'meteor/harrison/papa-parse'
import * as levenshtein from 'fast-levenshtein';

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

var currentContext = new ReactiveVar();

Tracker.autorun(function() {
    FlowRouter.watchPathChange();
    Session.set('currentContext',FlowRouter.current().path);
    // do anything with the current context
    // or anything you wish
});

Template.mainLayout.onCreated(() => {
    Meteor.subscribe("imageTimestamps.all");
    Meteor.subscribe("skudata.all");
});

Template.mainLayout.onRendered(() => {
    // fbImages.on('child_added', function(snapshot) {
    //     let image = new Image();
    //     image.src = 'data:image/jpg;base64,' + snapshot.val().image;
    //     // document.body.appendChild(image);
    //     //Create an object to download
    //     let downloadImg = image;
    //     downloadImg.src.replace('image/jpg', 'image/octet-stream');
    //     //Download the file
    //     let link = document.createElement('a');
    //     let filename = new Date();
    //     link.download = filename.getTime();
    //     link.href = downloadImg.src;
    //     link.click();
    //     Meteor.call('imageTimestamps.insert', filename.getTime());
    // });
});

Template.mainLayout.events({
    "click #upload": () => {
        FlowRouter.go("/upload");
    },
    "click #logs" : () => {
        FlowRouter.go("/");
    },
    "click #skupage" : () => {
        FlowRouter.go("/ocr")
    }
});

Template.mainLayout.helpers({
    currentRouteIs: (route) => {
        return (Session.equals('currentContext', route));
    }
});

Template.home.helpers({
    imageTimestamps: () => {
        return ImageTimestamps.find().fetch();
    }
});

Template.uploadcsv.onCreated( () => {
    Template.instance().uploading = new ReactiveVar( false );
    Meteor.subscribe("skudata.all");
});

Template.uploadcsv.helpers({
    uploading() {
        return Template.instance().uploading.get();
    },
    skuData: () => {
        return SKUData.find().fetch();
    }
});

Template.uploadcsv.events({
    'change [name="getcsvfile"]' ( event, template ) {
        template.uploading.set( true );

        Papa.parse( event.target.files[0], {
            header: true,
            complete( results, file ) {
                console.log(results);
                Meteor.call( 'parseUpload', results.data, ( error, response ) => {
                    if ( error ) {
                        console.log( error.reason );
                    } else {
                        template.uploading.set( false );
                        Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
                    }
                });
            }
        });
    }
});

Template.uploadcsv.onCreated( () => {
    Meteor.subscribe("skudata.all");
});
