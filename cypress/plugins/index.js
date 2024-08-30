cypress/e2e/plugins/index.js
require('cypress-xpath');
const sendSlackNotification = require('../../support/slack-notifier');

const { defineConfig } = require('cypress')

module.exports = defineConfig({
  
  e2e: {
        setupNodeEvents(on, config) {
        on('task', {
        
        async Slack_Notify({ message }) {
        const response = await sendSlackNotification(message)
        .then((res) => res)
        .catch((error) => {
        console.error('Failed to send Slack notification:', error);
        return null;
        });
        console.log(response, "res")  
        }
      })
    },
  },
})
// module.exports = (on, config) => {
 
//   on('task', {
   
//    async Slack_Notify({ message }) {
//     console.log("task triggered ")
//       const response = await sendSlackNotification(message)
//         .then((res) => res)
//         .catch((error) => {
//           console.error('Failed to send Slack notification:', error);
//           return null;
//         });
//       console.log(response, "res")  
//     }
//   });
// };
