const fs        = require('fs');
const SAXParser = require('parse5-sax-parser');
const parser    = new SAXParser({ sourceCodeLocationInfo: true });

const HtmlNode  = require('./html_node');
const Issues    = require('./issues');

module.exports = () => {
  let path;

  if (process.argv.length > 2) {
    path = process.argv[2];
  } else {
    console.log('No file specified');
    process.exit(1);
  }

  const stack = [];
  const issues = new Issues();
  let currentNode = new HtmlNode('root');

  parser.on('startTag', function (tag) {
    let nextNode = new HtmlNode(tag, currentNode);
    stack.push(nextNode);
    currentNode.children.push(nextNode);
    currentNode = nextNode;
  });

  parser.on('endTag', function (tag) {
    currentNode = currentNode.parent;
    if (stack.length <= 0 || stack[stack.length - 1].tag.tagName !== tag.tagName) {
      issues.push('mismatch_close_tag', tag);
    } else {
      stack.pop();
    }
  });

  const readFile = fs.createReadStream(path);
  readFile.pipe(parser).on('end', () => {
    if (stack.length > 0) {
      issues.push('unclosed_tag', stack[stack.length - 1].tag);
    }
    issues.forEach((issue) => {
      console.log(issue.print());
    });
  });
};
