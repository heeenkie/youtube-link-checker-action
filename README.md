# youtube-link-checker-action #

## Overview ##
Github Action to check the lenght of youtube videos provided in any README.
The check would be used on every pull request opened against the git head.
Sets the PR status to failure if the action finds a youtube link that does 
not meet the requiremtns.

## Setup ##
### 1 ###
Create a [GitHub Secret](https://docs.github.com/en/actions/reference/encrypted-secrets) and name it to 'YOUTUBE_API_KEY'.
The secret's value needs to be your youtube API key which you can get from [here](https://console.cloud.google.com/apis).

### 2 ###
Create a file with the following content under `.github/workflows/youtube-link-checker.yaml`:

```
name: Release-Notes-Preview

on: [push]

jobs:
  youtube-checker:
    runs-on: ubuntu-latest
    name: Checking length of potential youtube-video
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        # need to get the modified files
      - name: Get modified files
        run: |
          git fetch --quiet
          changed=$(git diff ${{ github.event.pull_request.head.sha }} ${{ github.event.pull_request.base.sha }} --name-only)
          # Ignoring new lines and such
          changed="${changed//'%'/'%25'}"
          changed="${changed//$'\n'/'%0A'}"
          changed="${changed//$'\r'/'%0D'}"
          echo "::set-output name=files::$changed"
        id: git-command
      - name: Youtube Checker Step
        uses: heeenkie/youtube-link-checker-action@1
        id: checker
        with:
          file-path: ${{ steps.git-command.outputs.files}}
          youtube-api-key: {{ secrets.YOUTUBE_API_KEY }}
          min-length: 100
          max-length: 1000
```

## DevOps Course DD2482 ##
This action is created for the course DD2482.
The following information is course specific to make it work according to the requirements

### Folder Specification ###
At the top of the created file, youtube-link-checker.yaml, we need to add code to only 
performe the action on pull request in a our specific folder.

```
on:
  pull_request:
    paths:
      -'contributions/demo/**'
```

### Video Length Specification ###
The requirements for the video length are set to be between 3 to 5 minutes or 180 to 300 seconds 
so this need to be added at the bottom of the file, youtube-link-checker.yaml.

```
 - name: Youtube Checker Step
        uses: heeenkie/youtube-link-checker-action@1
        id: checker
        with:
          file-path: ${{ steps.git-command.outputs.files}}
          youtube-api-key: {{ secrets.YOUTUBE_API_KEY }}
          min-length: 180
          max-length: 300
```

## Youtube Link Information ##
A Youtube can have many different looks and to capture them all with regex can be a mess.
This action uses a rather simple regex for first finding all links and then another regex for 
confirming if it is a youtube link or not. 

These regex contructions are tested and works for the following link:
- http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index
- http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o
- http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0
- http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s
- http://www.youtube.com/embed/0zM3nApSvMg?rel=0
- http://www.youtube.com/watch?v=0zM3nApSvMg
- http://youtu.be/0zM3nApSvMg
- All of the above wrapped in paranteses
