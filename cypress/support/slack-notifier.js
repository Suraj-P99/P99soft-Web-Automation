const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Make sure the path to your mochawesome report is correct
const reportPath = path.resolve('/Users/Suraj/P99soft-Slack/mochawesome-report/mochawesome_001.json');
const webhookUrl = 'https://hooks.slack.com/services/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'; // Your Slack webhook URL

// Function to parse test results
function parseTestResults(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(data, "data");

    // Adjust if the mochawesome report structure is different
    const passed = data.tests ? data.tests.filter(test => test.status === 'passed').length : 0;
    const failed = data.tests ? data.tests.filter(test => test.status === 'failed').length : 0;

    return { passed, failed };
  } catch (error) {
    console.error(`Error reading or parsing file ${filePath}:`, error.message);
    return { passed: 0, failed: 0 }; 
  }
}

// Function to send a notification to Slack
async function sendSlackNotification(message) {
  try {
    const payload = {
      text: message
    };
    await axios.post(webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('Notification sent to Slack');
  } catch (error) {
    console.error('Error sending notification to Slack:', error.message);
  }
}

// Main execution
async function main() {
  try {
    const results = parseTestResults(reportPath);
    console.log(`Passed: ${results.passed}, Failed: ${results.failed}`);

    const message = `Test Results: Passed - ${results.passed}, Failed - ${results.failed}`;
    await sendSlackNotification(message);
  } catch (error) {
    console.error('Error during main execution:', error.message);
  }
}

main();





// const axios = require('axios');

// const webhookUrl = 'https://hooks.slack.com/services/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'; 
//                    //'https://hooks.slack.com/services/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';

// async function sendSlackNotification(message) {
//   try {
//    await axios.post(webhookUrl,{
//       text:message
//   },{
//       headers: {
//           'Content-Type': 'application/json',
//       }})
  
//   } catch (e) {
//     const status = e.response.status;
//     console.error(`There was an error, HTTP status code: ${status}`);
//   }
// }
// module.exports = { sendSlackNotification };






