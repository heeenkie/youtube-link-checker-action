'use strict'
const core = require('@actions/core');
const github = require('@actions/github');
const { promises: fs, symlinkSync } = require('fs')
const fetch = require("node-fetch");
const moment = require('moment');

try {
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
          if (seconds < parseInt(core.getInput('min-length')) || seconds > parseInt(core.getInput('max-length'))) {
            core.setFailed(`Length: ${seconds} \n Duration of video ${id} does not meet the requirements \n`);
          } else {
            console.log(`Length: ${seconds} \n Duration of video ${id} meets the requirements \n`);
          }
        }
      });
}
