const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const filePath = core.getInput('file-path');

  console.log(`Hello ${filePath}!`);
  core.setOutput("reason", "Video meets the requirements");
  //core.setOutput("reason", "Video does not meet the requirements");
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
