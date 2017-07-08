(function () {
  'use strict';

  var util = jsonSchemaLib.util;

  describe('util.isSchema()', function () {

    it('should return true if passed a Schema object', function (done) {
      var schema = jsonSchemaLib.readSync(path.rel('schemas/no-refs.json'));
      expect(util.isSchema(schema)).to.be.true;
      done();
    });

    it('should return false if passed a File object', function (done) {
      var schema = jsonSchemaLib.readSync(path.rel('schemas/no-refs.json'));
      expect(util.isSchema(schema.rootFile)).to.be.false;
      done();
    });

    it('should return true for the "schema" argument inside a plugin', function (done) {
      var callCounter = 0;

      // Create a new instance of JsonSchemaLib with a dummy plugin
      var instance = jsonSchemaLib.create();
      instance.use({
        priority: 100,
        resolveURL: pluginMethod,
        readFileSync: pluginMethod,
        decodeFile: pluginMethod,
        parseFile: pluginMethod,
      });

      // Read the schema, using the dummy plugin
      instance.readSync(path.rel('schemas/external-refs-simple/vehicle.json'));

      // Make sure the `schema` argument of each plugin method passes `util.isSchema()`
      function pluginMethod (args) {
        expect(util.isSchema(args.schema)).to.be.true;
        callCounter++;
        args.next();
      }

      expect(callCounter).to.equal(32);
      done();
    });

    it('should return false if called without any args', function (done) {
      expect(util.isSchema()).to.be.false;
      done();
    });

    it('should return false if passed any non-Schema value', function (done) {
      expect(util.isSchema(undefined)).to.be.false;
      expect(util.isSchema(null)).to.be.false;
      expect(util.isSchema(NaN)).to.be.false;
      expect(util.isSchema('')).to.be.false;
      expect(util.isSchema('Schema')).to.be.false;
      expect(util.isSchema(true)).to.be.false;
      expect(util.isSchema(false)).to.be.false;
      expect(util.isSchema(0)).to.be.false;
      expect(util.isSchema(1)).to.be.false;
      expect(util.isSchema(-1)).to.be.false;
      expect(util.isSchema({})).to.be.false;
      done();
    });

  });
}());
