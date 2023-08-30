const fs = require('fs').promises; 
const path = require('path');
const DIRECTORY_PATH = path.join(__dirname, '../../files');

const findFile = async (startsWithStr) => {
  try {
    const files = await fs.readdir(DIRECTORY_PATH);

    const foundFiles =  files.filter(file => file.startsWith(startsWithStr));
    
    return foundFiles;
  } catch (err) {
    return err; 
  }
};

module.exports = {
  findFile
};
