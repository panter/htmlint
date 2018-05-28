const fs     = require('fs');
const Parser = require('./parser');

module.exports = () => {
  let path;

  if (process.argv.length > 2) {
    path = process.argv[2];
  } else {
    console.log('No file specified');
    process.exit(1);
  }

  const parser = new Parser();

  parser.parse(fs.createReadStream(path)).on('end', () => {
    parser.issues.forEach((issue) => {
      console.log(issue.print());
    });
  });
};
