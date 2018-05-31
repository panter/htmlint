const SaxParser    = require('parse5-sax-parser');
const { Readable } = require('stream');

const HtmlNode  = require('./html_node');
const Issues    = require('./issues');

const voids = [
  'area', 'base', 'br', 'col', 'embed', 'hr',
  'img', 'input', 'keygen', 'link', 'meta',
  'param', 'source', 'track', 'wbr'
];

const defaults = {
  indentation: 2
};

module.exports = class Parser {
  constructor (config) {
    config = Object.assign(defaults, config);

    this.stack = [];
    this.issues = new Issues();
    this.currentNode = new HtmlNode('root');

    this.saxParser = new SaxParser({ sourceCodeLocationInfo: true });

    const isVoid = (tag) => {
      return voids.includes(tag.tagName);
    };

    const lintIndendation = (currentTag, parentTag, offset = 0) => {
      const expected = (this.stack.length - offset) * config.indentation;
      const found    = currentTag.sourceCodeLocation.startCol - 1;

      if (offset && isVoid(currentTag)) {
        parentTag = this.currentNode.children[0].tag;
      }

      const currentLine  = currentTag.sourceCodeLocation.startLine;
      let   previousLine = 0;
      if (parentTag.sourceCodeLocation) {
        previousLine = parentTag.sourceCodeLocation.startLine;
      }

      if (found !== expected && currentLine > previousLine) {
        this.issues.push('indentation', currentTag, found, expected);
      }
    };

    this.saxParser.on('startTag', (tag) => {
      const nextNode = new HtmlNode(tag, this.currentNode);
      this.currentNode.children.push(nextNode);

      lintIndendation(tag, this.currentNode.tag);

      if (tag.selfClosing || isVoid(tag)) {
        return;
      }
      this.stack.push(nextNode);
      this.currentNode = nextNode;
    });

    this.saxParser.on('endTag', (tag) => {
      if (this.currentNode) {
        lintIndendation(tag, this.currentNode.tag, 1);
        this.currentNode = this.currentNode.parent;
      }
      if (this.stack.length <= 0 || this.stack[this.stack.length - 1].tag.tagName !== tag.tagName) {
        if (isVoid(tag)) {
          this.issues.push('void_close_tag', tag);
        } else {
          this.issues.push('mismatch_close_tag', tag);
        }
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
