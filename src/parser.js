const SaxParser    = require('parse5-sax-parser');
const { Readable } = require('stream');

const HtmlNode  = require('./html_node');
const Issues    = require('./issues');

module.exports = class Parser {
  constructor () {
    this.stack = [];
    this.issues = new Issues();
    this.currentNode = new HtmlNode('root');

    this.saxParser = new SaxParser({ sourceCodeLocationInfo: true });

    this.saxParser.on('startTag', (tag) => {
      const nextNode = new HtmlNode(tag, this.currentNode);
      this.stack.push(nextNode);
      this.currentNode.children.push(nextNode);
      this.currentNode = nextNode;
    });

    this.saxParser.on('endTag', (tag) => {
      this.currentNode = this.currentNode.parent;
      if (this.stack.length <= 0 || this.stack[this.stack.length - 1].tag.tagName !== tag.tagName) {
        this.issues.push('mismatch_close_tag', tag);
      } else {
        this.stack.pop();
      }
    });
  }

  parse (input) {
    let pipe;
    if (typeof input === 'string') {
      const readable = new Readable();
      readable.push(input);
      readable.push(null);
      pipe = readable.pipe(this.saxParser);
    } else {
      pipe = input.pipe(this.saxParser);
    }
    pipe.on('end', () => {
      if (this.stack.length > 0) {
        this.issues.push('unclosed_tag', this.stack[this.stack.length - 1].tag);
      }
    });
    return pipe;
  }
};
