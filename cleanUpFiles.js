const fs = require('fs');

const reportJson = './mochawesome-report/mochawesome_001.json';
const reporthtml = './mochawesome-report/mochawesome_001.html';

fs.unlink(reportJson, (err) => {
  if (err) {
    console.log(`Error deleting file: ${err.message}`);
  } else {
    console.log('File deleted successfully');
  }
});

fs.unlink(reporthtml, (err) => {
    if (err) {
      console.log(`Error deleting file: ${err.message}`);
    } else {
      console.log('File deleted successfully');
    }
  });