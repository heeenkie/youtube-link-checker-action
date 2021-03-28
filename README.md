# youtube-link-checker-action #


## Summary ##

Github Action to check the lenght of youtube videos provided in any README.
The check would be used on every pull request opened against the git head.
Sets the PR status to failure if the action finds a youtube link that does 
not meet the requiremtns.

## Setup ##

Create a file with the following content under `.github/workflows/youtube-link-checker.yaml`:

```
name: Release-Notes-Preview

on:
  pull_request:
    paths:
      # directory of the wanted check
      - 'contributions/demo/'

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
          changed="${changed//'%'/'%25'}"
          changed="${changed//$'\n'/'%0A'}"
          changed="${changed//$'\r'/'%0D'}"
          echo "::set-output name=files::$changed"
        id: git-command
      - name: Youtube Checker Step
        uses: ./
        id: checker
        with:
          file-path: ${{ steps.git-command.outputs.files}}
```
