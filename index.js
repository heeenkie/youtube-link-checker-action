'use strict'
const core = require('@actions/core');
const github = require('@actions/github');
const { promises: fs, symlinkSync } = require('fs')

try {
  // `who-to-greet` input defined in action metadata file
  const filePaths = core.getInput('file-path').split('\n');
  for (var path of filePaths) {
    if (path.toLowerCase().includes('readme')) {
      console.log('Readme file detected');
      fs.readFile(path, 'utf8').then((content) => {
        var videoId = youtube_videoId_parser(content);
        console.log(videoId);
      }).catch(error => core.setFailed(error.message));
    } 
  }
} catch (error) {
  core.setFailed(error.message);
}

function youtube_videoId_parser(url){
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[1].length==11)? match[1] : false;
}