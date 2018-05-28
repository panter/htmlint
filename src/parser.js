const SAXParser = require('parse5-sax-parser');
const parser    = new SAXParser({ sourceCodeLocationInfo: true });

const HtmlNode  = require('./html_node');
const Issues    = require('./issues');

module.exports = class Parser {
  constructor () {
    this.stack = [];
    this.issues = new Issues();
    this.currentNode = new HtmlNode('root');

    parser.on('startTag', (tag) => {
      const nextNode = new HtmlNode(tag, this.currentNode);
      this.stack.push(nextNode);
      this.currentNode.children.push(nextNode);
      this.currentNode = nextNode;
    });

    parser.on('endTag', (tag) => {
      this.currentNode = this.currentNode.parent;
      if (this.stack.length <= 0 || this.stack[this.stack.length - 1].tag.tagName !== tag.tagName) {
        this.issues.push('mismatch_close_tag', tag);
      } else {
        this.stack.pop();
      }
    });
  }

  onEnd () {
    if (this.stack.length > 0) {
      this.issues.push('unclosed_tag', this.stack[this.stack.length - 1].tag);
    }
    this.issues.forEach((issue) => {
      console.log(issue.print());
    });
  }

  get () {
    return parser;
  }
};
