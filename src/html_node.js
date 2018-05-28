module.exports = class HtmlNode {
  constructor (tag, currentNode) {
    this.tag = tag;
    this.parent = currentNode;
    this.children = [];
  }
};
