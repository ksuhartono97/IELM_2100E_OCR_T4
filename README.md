# IELM 2100E OCR Project - Group 4

Currently 3 parts of the project:
- Android App: image taking, sync to database
- Meteor webserver : main client for access to database and result
- ~~Darknet OCR : being worked on, will do the OCR and stuff~~
- OCRopus : the recognizer

## Building and Running Android App
Powered by Ionic and AngularFire

To get it to run, simply navigate to the directory (assuming you have Ionic setup) and in the command line enter the following

```
ionic run android
```

And it will deploy to your phone.

Notes:
- Needs an email + password authentication (not fully implemented, currently anyone can write or read into database)
- Writes into a shared images folder in the Firebase database.

# User Manual

This guide assumes the user is using a system running an Ubuntu OS. This is due to the complications with installations of our software using other OSes.

## General How To Use

1. Install and open the android app that we created (pass through the login, use our test account: "ksuhartono@connect.ust.hk" for the email and "thomas" as password or create your own account)
2. Use the app to take the picture
3. Receive the picture on the server (done automatically)
4. Feed the picture to the OCR
5. Receive result of OCR in `.txt` format
6. Feed `.txt` result to server client and let the server retrieve the matching result from database.
7. Refer to menu bar on the top of the server site to explore the site.

> Special Note: moving the file to the location accepted by the server and converting of the ocr output into .txt format that is accepted by the server are both currently **role prototyped**

More detailed instructions for each side below (Tech Specifications)

# Tech Specifications

Requirements:

- Operating System: Ubuntu
- Newest version of nodeJS and NPM
- OCRopus library git cloned or downloaded as zip
- Meteor JS
- An android phone

For install instructions, see below

## Installation

1. To install the android app, request us for a copy of the android app .apk file to be sent to you.
2. To install Meteor.js, go to <https://www.meteor.com/install> and follow the steps on site. Also you need to install NPM and nodeJS before that, type `sudo apt-get install nodejs` to install it if you haven't installed already
3. For the OCR, you need to install OCRopus, follow this link <https://github.com/tmbdev/ocropy> for steps on how to install. Note that you need to git clone the repository (or download as zip)

  - After installation, you will need to ask us for the weights file that we have trained for the OCR.
  - Also you need the `run-test` script that we have created.
  - You have to replace the default weights and script with ours.

### Android App side

1. First, install the apk file we provided.
2. After installation, open the app and grant it the permissions it requests (it simply requests for camera access so it can take pictures)
3. Follow on-screen login instructions (make an account if you do not have an account)
4. Click the camera button on the top right corner
5. Take a picture of the object you want
6. When finished the user should be prompted with a message that says `Image has been uploaded` and will be taken to the initial screen where the images are supposed to be.

### Server side

For the server side, we assume you have Meteor.js installed, along with all the necessary bindings.

1. Open up a terminal session
2. Navigate to the directory of the server's program and type in this command: `meteor`
3. If there are any errors during deployment, scroll through the error log and type in any command that the server client requests to install necessary dependencies.
4. Go to <http://localhost:3000/>
5. The GUI for the webserver will load up

From here you can use the server side, choose from the menus on which activity you want.

General notes:

- The upload database expects input in a .csv format
- Use the button to clear database in case of any duplicate data
- OCR result display expects the OCR output in a `.txt` format with the required inputs being in the first two lines.

### OCR Processing side

1. Put the image file in the directory that is specified inside the `run_test` script, or modify it to whatever directory you want (However we can't directly move the file and run a script so we are 'role prototyping' this part)
2. Run the `./run_test` command if you are sure that you have put the image in the directory.
3. Retrieve the output of the ocr and convert it to .txt manually (we don't have a way to convert right now, so in the same way, we are role prototyping this part)
4. Feed the .txt into the webserver.
