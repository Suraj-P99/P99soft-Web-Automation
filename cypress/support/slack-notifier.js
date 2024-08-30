const axios = require('axios');
const fs = require('fs');
const path = require('path');


const reportPath = path.resolve('/Users/Suraj/P99soft-Slack/mochawesome-report/mochawesome_001.json');
const webhookUrl = process.env.SLACK_WEBHOOK_URL; 


function isFileReady(filePath) {
 console.log(process.env.SLACK_WEBHOOK_URL,"url")  //
  try {
    const stats = fs.statSync(filePath);
    return stats.size > 0;
  } catch (error) {
    console.error(`Error checking file ${filePath}:`, error.message);
    return false;
  }
}
function parseTestResults(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    let totalTests = 0;
    let passed = 0;
    let failed = 0;
    let pending = 0;
    let duration = 0;

    
    data.results.forEach(result => {
      result.suites.forEach(suite => {
        totalTests += suite.tests.length;

        suite.tests.forEach(test => {
          if (test.state === 'passed') {
            passed++;
          } else if (test.state === 'failed') {
            failed++;
          } else if (test.state === 'pending') {
            pending++;
          }
        });

        duration += suite.duration;
      });

      // Add the duration from each result to the total duration
      duration += result.duration;
    });

    return { totalTests, passed, failed, pending, duration };
  } catch (error) {
    console.error(`Error reading or parsing file ${filePath}:`, error.message);
    return { totalTests: 0, passed: 0, failed: 0, pending: 0, duration: 0 }; 
  }
}


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
    console.log('Waiting for report file to be ready...');
    let attempts = 0;
    while (!isFileReady(reportPath) && attempts < 10) {
      attempts++;
      console.log(`Attempt ${attempts}: File not ready, retrying in 2 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
   
    if (!fs.existsSync(reportPath)) {
      console.error(`Report file does not exist at path: ${reportPath}`);
      return;
    }

    const results = parseTestResults(reportPath);
    console.log(`Total Tests: ${results.totalTests}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Pending: ${results.pending}`);
    console.log(`Duration: ${results.duration} ms`);

    const message = `Test Report:\nTotal Tests: ${results.totalTests}\nPassed: ${results.passed}\nFailed: ${results.failed}\nPending: ${results.pending}\nDuration: ${results.duration} ms`;
    await sendSlackNotification(message);
  } catch (error) {
    console.error('Error during main execution:', error.message);
  }
}

main();



