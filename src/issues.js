const TYPES = {
  mismatch_close_tag: 'Closing tag mismatch',
  unclosed_tag      : 'Unclosed element',
  void_close_tag    : 'Closing tag for void element'
};

const Issue = class Issue {
  constructor (type, tag) {
    this.type = type;
    this.tag  = tag;
  }

  print () {
    return `${
      TYPES[this.type] } for <${ this.tag.tagName }> detected at line ${
      this.tag.sourceCodeLocation.startLine }, column ${
      this.tag.sourceCodeLocation.startCol }.`;
  }
};

module.exports = class Issues extends Array {
  constructor () {
    super();
  }

  push (type, tag) {
    return super.push(new Issue(type, tag));
  }
};
