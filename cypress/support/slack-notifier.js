const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');
require('dotenv').config();
const path = require('path'); 

const webhookUrl = process.env.SLACK_WEBHOOK_URL; 
const directory = './mochawesome-report';

async function parseAllHtmlReports(directory) {
  const allTestCases = [];

  const files = fs.readdirSync(directory);
  for (const file of files) {
    if (path.extname(file) === '.html') {
      const filePath = path.join(directory, file);
      const testCases = await parseHtmlReport(filePath);
      allTestCases.push(...testCases);
    }
  }

  return allTestCases;
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

async function parseAllTestResults(directory) {
  let totalTests = 0;
  let passed = 0;
  let failed = 0;
  let pending = 0;
  let duration = 0;
  let totalFiles = 0;

  const files = fs.readdirSync(directory);
  for (const file of files) {
   if (path.extname(file) === '.json') {
      totalFiles++;
      const filePath = path.join(directory, file);
      const results = await parseTestResults(filePath);
      totalTests += results.totalTests;
      passed += results.passed;
      failed += results.failed;
      pending += results.pending;
      duration += results.duration;
    }
  }
  return { totalTests, passed, failed, pending, duration, totalFiles };
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

    const failedTestCases = testCases.filter(testCase => testCase.status === 'failed' || testCase.status === 'pending');
    let testCaseBlocks =[]
    if (failedTestCases.length <= 45) {
       testCaseBlocks = failedTestCases.map(testCase => ({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${testCase.status === 'passed' ? ':white_check_mark:' : testCase.status === 'failed' ? ':x:' : ':hourglass_flowing_sand:'} ${testCase.status === 'failed' ? `*${testCase.name}*` : testCase.name}`
        }
      }));
      } else {
        testCaseBlocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Alert*:warning-red:*: More than ${failedTestCases.length-1} test cases have failed,  and the website appears to be down now. Immediate attention required*:alert:`
          }
        });
       }

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
            },
            {
              type: "mrkdwn",
              text: `*Total test files:*\n${testReport.totalFiles}`
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

// Function to check if any JSON and HTML files are present in the directory
function areFilesReady(directory) {
  const files = fs.readdirSync(directory);
  const hasJson = files.some(file => path.extname(file) === '.json');
  const hasHtml = files.some(file => path.extname(file) === '.html');
  return hasJson && hasHtml;
}

// Main execution
async function main() {
  try {
    console.log('Waiting for report file to be ready...');
    let attempts = 0;

    while (attempts < 10 && !areFilesReady(directory)) {
      attempts++;
      console.log(`Attempt ${attempts}: Files not ready, retrying in 2 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (!areFilesReady(directory)) {
      console.error('Required report files do not exist in the directory.');
      return;
    }

    const results = await parseAllTestResults(directory);
    const testCases = await parseAllHtmlReports(directory);
    console.log(`Total Tests: ${results.totalTests}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Pending: ${results.pending}`);
    console.log(`Duration: ${results.duration} ms`);
    console.log(`Total Files: ${results.totalFiles}`);

    const message = `Test Report:\nTotal Tests: ${results.totalTests}\nPassed: ${results.passed}\nFailed: ${results.failed}\nPending: ${results.pending}\nDuration: ${results.duration} ms\nTotal Files: ${results.totalFiles}`;
    await sendSlackNotification(message,results,testCases);
  } catch (error) {
    console.error('Error during main execution:', error.message);
  }
}
exports.main = main;



