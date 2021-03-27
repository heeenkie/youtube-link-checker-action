'use strict'
const core = require('@actions/core');
const github = require('@actions/github');
const { promises: fs, symlinkSync } = require('fs')

try {
  // `who-to-greet` input defined in action metadata file
  var filePaths = core.getInput('file-path');
  console.log("Test-- " + filePaths);
  filePaths.replace('[', '')
  filePaths.replace(']', '')
  filePaths.replace('"', '')
  var filePathsArr = filePaths.split(',')
  for (var path of filePathsArr) {
    if (path.toLowerCase().includes('readme')) {
      console.log('Readme file updated');
      fs.readFile(path, 'utf8').then((content) => {
        var result = content.match(/(https?:\/\/[^\s]+)/g);
        for (r of result) {
          if (r.includes('youtube')) {
            core.setOutput('reason', 'Video meets the requirements');
          }
        }
      }).catch(error => core.setFailed(error.message));
    } 
  }
} catch (error) {
  core.setFailed(error.message);
}
ssd