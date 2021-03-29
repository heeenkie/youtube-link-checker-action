'use strict'
const core = require('@actions/core');
const github = require('@actions/github');
const { promises: fs, symlinkSync } = require('fs')
const fetch = require("node-fetch");
const moment = require('moment');

try {
  // `who-to-greet` input defined in action metadata file
  const filePaths = core.getInput('file-path').split('\n');
  for (var path of filePaths) {
    if (path.toLowerCase().includes('readme')) {
      fs.readFile(path, 'utf8').then((content) => {
        var urls = findAllURLs(content);
        console.log('Videos:');
        for (var url of urls) {
          var videoId = youtube_videoId_parser(url);
          if (videoId != false) {
            checkDuration(videoId)
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

function checkDuration(id) {
  let key = core.getInput('youtube-api-key');
  let uRl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${key}`;
  let settings = { method: 'Get'}
  fetch(uRl, settings)
    .then(res => res.json())
      .then((json) => {
        let items = json.items;
        if (items.length == 1) {
          let duration = items[0].contentDetails.duration;
          let seconds = moment.duration(duration, moment.ISO_8601).asSeconds();
          if (seconds < core.getInput('min-length') || seconds > core.getInput('max-length')) {
            core.setFailed(`Length: ${seconds} \n Duration of video ${id} does not meet the requirements \n`);
          } else {
            console.log(`Length: ${seconds} \n Duration of video ${id} meets the requirements \n`);
          }
        }
      });
}
