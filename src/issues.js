const TYPES = {
  mismatch_close_tag: 'Closing tag mismatch',
  unclosed_tag      : 'Unclosed element',
  void_close_tag    : 'Closing tag for void element',
  indentation       : 'Wrong indentation'
};

const Issue = class Issue {
  constructor (type, tag, found, expected) {
    this.type     = type;
    this.tag      = tag;
    this.found    = found;
    this.expected = expected;
  }

  print () {
    const codeLocation = `line ${
      this.tag.sourceCodeLocation.startLine }, column ${
      this.tag.sourceCodeLocation.startCol }`;

    if (this.expected !== undefined) {
      return `${ TYPES[this.type] }, expected ${ this.expected } but found ${ this.found } at ${
        codeLocation }.`;
    }
    return `${ TYPES[this.type] } for <${ this.tag.tagName }> detected at ${ codeLocation }.`;
  }
};

module.exports = class Issues extends Array {
  constructor () {
    super();
  }

  push (type, tag, found, expected) {
    return super.push(new Issue(type, tag, found, expected));
  }
};
