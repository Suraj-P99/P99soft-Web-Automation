const slackNotifier = require('./cypress/support/slack-notifier');
async function sendSlackNotification() {
    slackNotifier.main()
}
sendSlackNotification()