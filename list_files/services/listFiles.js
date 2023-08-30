const fs = require('fs').promises; 
const path = require('path');

const DIRECTORY_PATH = path.join(__dirname, '../../files');

const listFiles = async () => {
  try {
    const files = await fs.readdir(DIRECTORY_PATH);

    return files;
  } catch (err) {
    return err; 
  }
};

module.exports = {
  listFiles
};

