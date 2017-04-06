# IELM 2100E OCR Project - Group 4

Currently 3 parts of the project:
- Android App: image taking, sync to database
- Meteor webserver : central
- Darknet OCR : being worked on, will do the OCR and stuff

## Android App
Powered by Ionic and AngularFire

To get it to run, simply navigate to the directory (assuming you have Ionic setup) and in the command line enter the following

```
ionic run android
```

And it will deploy to your phone.

Notes:
- Needs an email + password authentication (not fully implemented, currently anyone can write or read into database)
- Writes into a shared images folder in the Firebase database.
