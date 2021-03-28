'use strict'
const core = require('@actions/core');
const github = require('@actions/github');
const { promises: fs, symlinkSync } = require('fs')
require('iced-coffee-script/register');
//const gapi = require('gapi')
const {gapi} = require('googleapis');

try {
  // `who-to-greet` input defined in action metadata file
  const filePaths = core.getInput('file-path').split('\n');
  for (var path of filePaths) {
    if (path.toLowerCase().includes('readme')) {
      fs.readFile(path, 'utf8').then((content) => {
        var urls = findAllURLs(content);
        for (var url of urls) {
          var videoId = youtube_videoId_parser(url);
          if (videoId != false) {
            authenticate().then(loadClient).then(() => console.log(findLength(videoId)));
            console.log(findLength(videoId));
          }
        }
      }).catch(error => core.setFailed(error.message));
    } 
  }
} catch (error) {
  core.setFailed(error.message);
}

function youtube_videoId_parser(url) {
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?\)]*).*/;
    var match = url.match(regExp);
    return (match&&match[1].trim().length==11)? match[1].trim() : false;
}

function findAllURLs(str) {
  return str.match(/(https?\:\/\/)?([^\.\s]+)?[^\.\s]+\.[^\s]+/gi);
}

// http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index
// http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o
// http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0
// http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s
// http://www.youtube.com/embed/0zM3nApSvMg?rel=0
// http://www.youtube.com/watch?v=0zM3nApSvMg
// http://youtu.be/0zM3nApSvMg
// Wrapped in paranteses






  /**
   * Sample JavaScript code for youtube.videos.list
   * See instructions for running APIs Explorer code samples locally:
   * https://developers.google.com/explorer-help/guides/code_samples#javascript
   */


// Make sure the client is loaded and sign-in is complete before calling this method.
function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
  function loadClient() {
    gapi.client.setApiKey("AIzaSyBbds7Xg7MqSiwwZR8e_3qAOkKLfURPeFo");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute(id) {
    return gapi.client.youtube.videos.list({
      "part": [
        "snippet,contentDetails,statistics"
      ],
      "id": [
        id
      ]
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
                return response;
              },
              function(err) { console.error("Execute error", err); return null;});
  }
  gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: "427844486063-45ilapmunjls8e8la2dblmad70nvo3bm.apps.googleusercontent.com"});
  });
