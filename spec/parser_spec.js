describe('Parser', () => {

  beforeEach(function () {
    this.module = require('../src/parser');
    this.instance = new this.module();
  });

  describe('with valid HTML', () => {

    beforeEach(function (done) {
      this.stringStream.parse(this.instance, '<a><b></b></a>', done);
    });

    it('has no issues', function () {
      expect(this.instance.issues.length).toBe(0);
    });
  });

  describe('with invalid HTML', () => {

    beforeEach(function (done) {
      this.stringStream.parse(this.instance, '<a><b></a>', done);
    });

    it('finds two issues', function () {
      expect(this.instance.issues.length).toBe(2);
    });
  });
});
