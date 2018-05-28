const TYPES = {
  mismatch_close_tag: 'Mismatching close tag',
  unclosed_tag      : 'Unclosed element'
};

const Issue = class Issue {
  constructor (type, tag) {
    this.type = type;
    this.tag  = tag;
  }

  print () {
    return `${ TYPES[this.type] } detected at line ${ this.tag.sourceCodeLocation.startLine }, column ${ this.tag.sourceCodeLocation.startCol }`;
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
