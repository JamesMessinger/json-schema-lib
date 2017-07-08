(function () {
  'use strict';

  var util = jsonSchemaLib.util;

  describe('util.isFile()', function () {

    it('should return true if passed a File object', function (done) {
      var schema = jsonSchemaLib.readSync(path.rel('schemas/external-refs-simple/vehicle.json'));

      schema.files.forEach(function (file) {
        expect(util.isFile(file)).to.be.true;
      });

      done();
    });

    it('should return false if passed a Schema object', function (done) {
      var schema = jsonSchemaLib.readSync(path.rel('schemas/no-refs.json'));
      expect(util.isFile(schema)).to.be.false;
      done();
    });

    it('should return true for the "file" argument inside a plugin', function (done) {
      var callCounter = 0;

      // Create a new instance of JsonSchemaLib with a dummy plugin
      var instance = jsonSchemaLib.create();
      instance.use({
        priority: 100,
        readFileSync: pluginMethod,
        decodeFile: pluginMethod,
        parseFile: pluginMethod,
      });

      // Read the schema, using the dummy plugin
      instance.readSync(path.rel('schemas/external-refs-simple/vehicle.json'));

      // Make sure the `schema` argument of each plugin method passes `util.isFile()`
      function pluginMethod (args) {
        expect(util.isFile(args.file)).to.be.true;
        callCounter++;
        args.next();
      }

      expect(callCounter).to.equal(24);
      done();
    });

    it('should return false if called without any args', function (done) {
      expect(util.isFile()).to.be.false;
      done();
    });

    it('should return false if passed any non-Schema value', function (done) {
      expect(util.isFile(undefined)).to.be.false;
      expect(util.isFile(null)).to.be.false;
      expect(util.isFile(NaN)).to.be.false;
      expect(util.isFile('')).to.be.false;
      expect(util.isFile('Schema')).to.be.false;
      expect(util.isFile(true)).to.be.false;
      expect(util.isFile(false)).to.be.false;
      expect(util.isFile(0)).to.be.false;
      expect(util.isFile(1)).to.be.false;
      expect(util.isFile(-1)).to.be.false;
      expect(util.isFile({})).to.be.false;
      done();
    });

  });
}());
