(function () {
  'use strict';

  var util = jsonSchemaLib.util;

  describe('util.isFile()', function () {

    it('should return true if passed a File object', function (done) {
      var schema = jsonSchemaLib.readSync(path.rel('schemas/external-refs-multiple/vehicle.json'));

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
      var myPlugin = {
        priority: 100,
        readFileSync: sinon.spy(checkFileArgument),
        decodeFile: sinon.spy(checkFileArgument),
        parseFile: sinon.spy(checkFileArgument),
      };

      // Read the schema, using the dummy plugin
      var instance = jsonSchemaLib.create();
      instance.use(myPlugin);
      instance.readSync(path.rel('schemas/external-refs-single/person.json'));

      // Make sure the `file` argument of each plugin method passes `util.isFile()`
      function checkFileArgument (args) {
        expect(util.isFile(args.file)).to.be.true;
        args.next();
      }

      // Each plugin method should have been called twice (the schema has 2 files)
      sinon.assert.calledTwice(myPlugin.readFileSync);
      sinon.assert.calledTwice(myPlugin.decodeFile);
      sinon.assert.calledTwice(myPlugin.parseFile);

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
