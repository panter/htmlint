const SAXParser = require('parse5-sax-parser');
const parser = new SAXParser({ sourceCodeLocationInfo: true });
const fs     = require('fs');

module.exports = () => {
  let path;

  if (process.argv.length > 2) {
    path = process.argv[2];
  } else {
    console.log('No file specified');
    process.exit(1);
  }

  const stack = [];

  parser.on('startTag', function (tag) {
    if (!tag.selfClosing) {
      stack.push(tag.tagName);
    }
  });

  parser.on('endTag', function (tag) {
    const index = stack.lastIndexOf(tag.tagName);
    if (index > -1) {
      stack.splice(index, 1);
    }
  });

  const readFile = fs.createReadStream(path);
  readFile.pipe(parser).on('end', () => {
    if (stack.length > 0) {
      console.log(`Found unclosed tags at ${ stack[stack.length - 1] }`);
    }
  });
};
