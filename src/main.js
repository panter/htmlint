const parse5 = require('parse5');
const fs     = require('fs');

module.exports = () => {
  let path;

  if (process.argv.length > 2) {
    path = process.argv[2];
  } else {
    console.log('No file specified');
    process.exit(1);
  }

  fs.readFile(path, (err, data) => {
    if (err) {
      throw err;
    }
    debugger;
    const documentFragment = parse5.parseFragment(String(data));
    console.log(documentFragment.childNodes[0].tagName);
  });
};
