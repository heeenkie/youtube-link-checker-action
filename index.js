'use strict'
const core = require('@actions/core');
const github = require('@actions/github');
const { promises: fs } = require('fs')

try {
  // `who-to-greet` input defined in action metadata file
  const filePaths = core.getInput('file-path').split(' ');
  core.setOutput('reason', core.getInput('file-path'))
  // for (var path of filePaths) {
  //   if (path.toLowerCase().includes('readme')) {
  //     fs.readFile(path, 'utf8').then((content) => {
  //       var result = content.match(/(https?:\/\/[^\s]+)/g);
  //       for (r of result) {
  //         if (r.includes('youtube')) {
  //           core.setOutput('reason', 'Video meets the requirements');
  //         }
  //       }
  //     }).catch(error => core.setFailed(error.message));
  //   }
  // }
} catch (error) {
  core.setFailed(error.message);
}
