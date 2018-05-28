
beforeEach(function () {
  this.stringStream = {
    parse: (parser, html, done) => {
      const { Readable } = require('stream');
      const readable = new Readable();
      readable.push(html);
      readable.push(null);
      readable.pipe(parser.get()).on('end', () => {
        this.instance.onEnd();
        done();
      });
    }
  };
});
