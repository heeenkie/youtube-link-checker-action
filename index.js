'use strict'
const core = require('@actions/core');
const github = require('@actions/github');
const { promises: fs } = require('fs')

try {
  // `who-to-greet` input defined in action metadata file
  const filePaths = core.getInput('file-path').split(' ');
  
  for (var path of filePaths) {
    if (path.toLowerCase().includes('readme')) {
      const content = fs.readFile(path, 'utf8').then((val) => {
        var result = content.match(/(https?:\/\/[^\s]+)/g);
        for (r of result) {
          if (r.includes('youtube')) {
            core.setOutput('reason', 'Video meets the requirements');
          }
        }
      });
    }
  }
  const payload = JSON.stringify(github.context.payload, undefined, 2)
} catch (error) {
  core.setFailed(error.message);
}
