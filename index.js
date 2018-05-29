const fs     = require('fs');
const Parser = require('./src/parser');

module.exports = {

  checkFile: (path) => {
    const parser = new Parser();

    return new Promise((resolve) => {
      parser.parse(fs.createReadStream(path)).on('end', () => {
        resolve(parser.issues);
      });
    });
  },

  checkString: (string) => {
    const parser = new Parser();

    return new Promise((resolve) => {
      parser.parse(string).on('end', () => {
        resolve(parser.issues);
      });
    });
  }
};
