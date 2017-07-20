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
      var myPlugin = {
        priority: 100,
        resolveURL: sinon.spy(checkSchemaArgument),
        readFileSync: sinon.spy(checkSchemaArgument),
        decodeFile: sinon.spy(checkSchemaArgument),
        parseFile: sinon.spy(checkSchemaArgument),
        finished: sinon.spy(checkSchemaArgument),
      };

      // Read the schema, using the dummy plugin
      var instance = jsonSchemaLib.create();
      instance.use(myPlugin);
      instance.readSync(path.rel('schemas/external-refs-single/person.json'));

      // Make sure the `schema` argument of each plugin method passes `util.isSchema()`
      function checkSchemaArgument (args) {
        expect(util.isSchema(args.schema)).to.be.true;
        args.next();
      }

      // Make sure each of the plugin methods was called as expected
      sinon.assert.callCount(myPlugin.resolveURL, 5);
      sinon.assert.calledTwice(myPlugin.readFileSync);
      sinon.assert.calledTwice(myPlugin.decodeFile);
      sinon.assert.calledTwice(myPlugin.parseFile);
      sinon.assert.calledOnce(myPlugin.finished);

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
