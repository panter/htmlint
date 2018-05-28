const { Readable } = require('stream');

beforeEach(function () {
  this.stringStream = {
    parse: (parser, html, done) => {
      const readable = new Readable();
      readable.push(html);
      readable.push(null);
      readable.pipe(parser.get()).on('end', () => {
        parser.onEnd();
        done();
      });
    }
  };
});
