(function () {
  'use strict';

  describe('exports', function () {

    it('should export the "read" function', function (done) {
      expect(jsonSchemaLib.read).to.be.a('function');
      done();
    });

    it('should export the "readAsync" function', function (done) {
      expect(jsonSchemaLib.readAsync).to.be.a('function');
      done();
    });

    it('should export the "readSync" function', function (done) {
      expect(jsonSchemaLib.readSync).to.be.a('function');
      done();
    });

    it('should export the "create" function for creating multiple instances', function (done) {
      expect(jsonSchemaLib.readSync).to.be.a('function');
      done();
    });

    it('should export the "config" object for the default instance', function (done) {
      expect(jsonSchemaLib.config).to.be.an('object');
      done();
    });

    it('should export the "plugins" object for the default instance', function (done) {
      expect(jsonSchemaLib.plugins).to.be.an('object');
      done();
    });

    it('should export the "util" object for plugin developers', function (done) {
      expect(jsonSchemaLib.util).to.be.an('object');
      done();
    });

    it('should alias the default export as "default" for Babel, TypeScript, etc.', function (done) {
      expect(jsonSchemaLib.default).to.be.an('object');
      expect(jsonSchemaLib.default).to.equal(jsonSchemaLib);
      done();
    });

    it('should not export anything else', function (done) {
      expect(jsonSchemaLib).to.have.all.keys(
        'read', 'readAsync', 'readSync', 'create', 'config', 'plugins', 'util', 'default'
      );
      done();
    });

  });
}());
