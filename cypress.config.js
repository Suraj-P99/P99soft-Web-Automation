const { defineConfig } = require("cypress");
const sendSlackNotification = require('./cypress/support/slack-notifier');

module.exports = defineConfig({
  reporter: 'mochawesome',
  reporterOptions: {
    // To display small circular charts regarding test results
    charts: true,
    json:true,
    // Generate new report file or overwrite the a single file
    overwrite: false
  },
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
       async Slack_Notify({ message }) {
          console.log(message,"message")
          return sendSlackNotification.sendSlackNotification(message)
            .then(() => null) 
            .catch((error) => {
              console.error('Failed to send Slack notification:', error);
              return null;
            });
          }
      });
      
      }
      
      // implement node event listeners here
    },
  },
);
