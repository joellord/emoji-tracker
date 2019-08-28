# Emoji Tracker
This tool tracks emojis on tweets. It uses a list of keywords that it should track and the counts the emojis.

## API
`/emojis`
Returns a JSON object with the list of emojis that have been tracked and how often they came up.

`/emojis/top`
Returns a string showing the top three emojis that have been used.

## Demo
Currently tracking #devrel:
* [Emojis](http://emoji-tracker-emoji-tracker.b9ad.pro-us-east-1.openshiftapps.com/emojis)
* [Top Three](http://emoji-tracker-emoji-tracker.b9ad.pro-us-east-1.openshiftapps.com/emojis/top)

## Tracked keywords
List of keywords that are tracked can be configured in `/keywords.json`

## Installation instructions
You can deploy on OpenShift or your own minishift cluster locally:
* Install [minishift](https://www.okd.io/minishift/)
* Install [oc](https://www.okd.io/)
* Start minishift
  * `minishift start`
* Login to minishift and create a new project
  * `oc login`
  * `oc new-project emoji-tracker`
* Deploy the application
  * `oc new-app https://github.com/joellord/emoji-tracker.git CONSUMER_KEY=XXX CONSUMER_SECRET=XXX ACCESS_TOKEN_KEY=XX-XXX ACCESS_TOKEN_SECRET=XXX PORT=8080`
* Expose a route
  * `oc expose service/emoji-tracker 8080`

## Required environment variables
Environment variables can be set in a .env file
* CONSUMER_KEY: Found in the Twitter developer console
* CONSUMER_SECRET: Found in the Twitter developer console
* ACCESS_TOKEN_KEY: Found in the Twitter developer console
* ACCESS_TOKEN_SECRET: Found in the Twitter developer console
* PORT: Port on which the express server should run