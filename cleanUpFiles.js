const fs = require('fs');
const path = require('path');

const directory = './mochawesome-report';

// Function to delete files with specific extensions
const deleteFiles = (dir, extensions) => {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.log(`Error reading directory: ${err}`);
      return;
    }

    files.forEach(file => {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        const filePath = path.join(dir, file);
        fs.unlink(filePath, err => {
          if (err) {
            console.log(`Error deleting file ${file}: ${err}`);
            return;
          }
          console.log(`Deleted file: ${file}`);
        });
      }
    });
  });
};

// Delete all .json and .html files in the specified directory
deleteFiles(directory, ['.json', '.html']);
