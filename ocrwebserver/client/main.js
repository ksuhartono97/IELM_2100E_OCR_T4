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
var outputStrings = new ReactiveVar();
var searchResult = new ReactiveVar();

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
    },
    'click #emptyDatabase' : () => {
        Meteor.call('wipeParseData');
    }
});

Template.ocr.onCreated( () => {
    Template.instance().uploading = new ReactiveVar( false );
    Meteor.subscribe("skudata.all");
});

Template.ocr.helpers({
    uploading() {
        return Template.instance().uploading.get();
    },
    outputString() {
        return Session.get("outputStrings");
    },
    searchResult() {
        return Session.get("searchResult");
    }
});

Template.ocr.events({
   'change [name="getocrdata"]' (event, template) {
       template.uploading.set(true);

       let tempReader = new FileReader();
       tempReader.onload = function (e) {
           //Update the DOM with the fetched string
           Session.set('outputStrings', e.target.result);

           //Split the string
           let res = e.target.result.split(/\r?\n/);

           //Construct an array and do matching with levenshtein with database
           let simArray = [];
           const skudata = SKUData.find().fetch();

           skudata.forEach((data) => {
              let simScore = 0;
              simScore += levenshtein.get(res[0], data.UniqloAttrValue1);
              simScore += levenshtein.get(res[1], data.UniqloAttrValue2);
              simArray.push({id:data._id, sim: simScore});
           });

           //Find the best matched object
           let minIndex = 0;
           for(let i = 0; i < simArray.length; i++) {
               if(simArray[i].sim < simArray[minIndex].sim) {
                   minIndex = i;
               }
           }

           //Do a retrieval from database of best object, update the html view
           const relatedDatabaseResult = SKUData.find({_id:simArray[minIndex].id}).fetch();
           Session.set('searchResult', relatedDatabaseResult);

           //Complete the operation
           template.uploading.set( false );
           Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
       };
       tempReader.readAsText(event.target.files[0]);
   }
});
