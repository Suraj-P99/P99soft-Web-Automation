const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');
require('dotenv').config();


const reportPath =  './mochawesome-report/mochawesome_001.json';
const reporthtml = './mochawesome-report/mochawesome_001.html';
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

async function parseHtmlReport(filePath = reportHtmlPath) {
  try {
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(htmlContent);
    const testCases = [];

    const rawData = $('body').attr('data-raw');
    const reportData = JSON.parse(rawData);

    reportData.results.forEach(result => {
      result.suites.forEach(suite => {
        suite.tests.forEach(test => {
          testCases.push({
            name: test.title, // Use the 'title' property to get only the test title
            status: test.state
          });
        });
      });
    });

    return testCases;
  } catch (error) {
    console.error(`Error reading or parsing HTML file ${filePath}:`, error.message);
    return [];
  }
}

async function parseTestResults(filePath) {
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


async function sendSlackNotification(message,testReport,testCases) {
  try {
    // const payload = {
    //   text: message
    // };
//${testCase.status.charAt(0).toUpperCase() + testCase.status.slice(1)}
    const testCaseBlocks = testCases.map(testCase => ({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `${testCase.status === 'passed' ? ':white_check_mark:' : testCase.status === 'failed' ? ':x:': ':hourglass_flowing_sand:'} ${testCase.status === 'failed' ? `*${testCase.name}*` : testCase.name}`
      }
    }));

    const payload = {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Test Report*"
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Total Tests:*\n${testReport.totalTests}`
            },
            {
              type: "mrkdwn",
              text: `*Duration:*\n${testReport.duration} ms`
            }
          ]
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Passed:*\n:white_check_mark: ${testReport.passed}`
            },
            {
              type: "mrkdwn",
              text: `*Failed:*\n:x: ${testReport.failed}`
            },
            {
              type: "mrkdwn",
              text: `*Pending:*\n:hourglass_flowing_sand: ${testReport.pending}`
            },
          ]
        },  
        {
          type: "divider"
        },
        ...testCaseBlocks
      ]
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

    const results = await parseTestResults(reportPath);
    const testCases = await parseHtmlReport(reporthtml);
    console.log(`Total Tests: ${results.totalTests}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Pending: ${results.pending}`);
    console.log(`Duration: ${results.duration} ms`);

    const message = `Test Report:\nTotal Tests: ${results.totalTests}\nPassed: ${results.passed}\nFailed: ${results.failed}\nPending: ${results.pending}\nDuration: ${results.duration} ms`;
    await sendSlackNotification(message,results,testCases);
  } catch (error) {
    console.error('Error during main execution:', error.message);
  }
}

exports.main = main;



