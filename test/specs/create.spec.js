(function () {
  'use strict';

  describe('create()', function () {

    it('should use the default config and plugins when called with no params', function (done) {
      var instance = jsonSchemaLib.create();

      expect(instance).not.to.equal(jsonSchemaLib);
      expect(instance.config).not.to.equal(jsonSchemaLib.config);
      expect(instance.config).to.deep.equal(jsonSchemaLib.config);
      expect(instance.plugins).not.to.equal(jsonSchemaLib.plugins);
      expect(instance.plugins).to.deep.equal(jsonSchemaLib.plugins);

      done();
    });

    it('should use the default config and plugins when called with null/undefined', function (done) {
      var args = [
        [undefined],
        [null],
        [undefined, undefined],
        [undefined, null],
        [null, undefined],
        [null, null],
      ];

      args.forEach(function (arg) {
        var instance = jsonSchemaLib.create.apply(jsonSchemaLib, arg);

        expect(instance).not.to.equal(jsonSchemaLib);
        expect(instance.config).not.to.equal(jsonSchemaLib.config);
        expect(instance.config).to.deep.equal(jsonSchemaLib.config);
        expect(instance.plugins).not.to.equal(jsonSchemaLib.plugins);
        expect(instance.plugins).to.deep.equal(jsonSchemaLib.plugins);
      });

      done();
    });

    it('should use a custom config', function (done) {
      var config = {
        customSetting: 'foo',
        http: {
          headers: {
            'Cache-Control': 'no-cache',
          }
        }
      };

      var mergedConfig = helpers.getDefaultConfig();
      mergedConfig.customSetting = 'foo';
      mergedConfig.http.headers['Cache-Control'] = 'no-cache';

      var instance = jsonSchemaLib.create(config);

      expect(instance).not.to.equal(jsonSchemaLib);
      expect(instance.plugins).to.deep.equal(jsonSchemaLib.plugins);
      expect(instance.config).to.deep.equal(mergedConfig);

      done();
    });

    it('should use custom plugins', function (done) {
      var plugin1 = { name: 'Plugin1', foo: 'bar' };
      var plugin2 = { name: 'Plugin2', fizz: 'buzz' };

      var instance = jsonSchemaLib.create([plugin1, plugin2]);

      expect(instance).not.to.equal(jsonSchemaLib);
      expect(instance.config).to.deep.equal(jsonSchemaLib.config);

      expect(instance.plugins).to.deep.equal([plugin1, plugin2]);

      done();
    });

    it('should use custom config and plugins', function (done) {
      var plugin1 = { name: 'Plugin1', foo: 'bar' };
      var plugin2 = { name: 'Plugin2', fizz: 'buzz' };
      var config = {
        customSetting: 'foo',
        http: {
          headers: {
            'Cache-Control': 'no-cache',
          }
        }
      };

      var mergedConfig = helpers.getDefaultConfig();
      mergedConfig.customSetting = 'foo';
      mergedConfig.http.headers['Cache-Control'] = 'no-cache';

      var instance = jsonSchemaLib.create(config, [plugin1, plugin2]);

      expect(instance).not.to.equal(jsonSchemaLib);
      expect(instance.config).to.deep.equal(mergedConfig);
      expect(instance.plugins).to.deep.equal([plugin1, plugin2]);

      done();
    });

    it.skip('can be called as a standalone function', function (done) {
      var create = jsonSchemaLib.create;
      var instance = create({ myConfig: 'foo' });

      // Instance properties
      expect(instance).to.have.all.keys('plugins', 'config');
      expect(instance.config).to.have.property('myConfig', 'foo');

      // Prototype properties
      expect(instance.read).to.be.a('function');
      expect(instance.readSync).to.be.a('function');
      expect(instance.readAsync).to.be.a('function');
      expect(instance.use).to.be.a('function');

      done();
    });

    it.skip('should throw an error if called with invalid config', function (done) {
      var expectedError = 'Invalid arguments. Expected a configuration object.';

      expect(callCreate(0)).to.throw(expectedError);
      expect(callCreate(12345)).to.throw(expectedError);
      expect(callCreate(Infinity)).to.throw(expectedError);
      expect(callCreate(NaN)).to.throw(expectedError);
      expect(callCreate(true)).to.throw(expectedError);
      expect(callCreate(false)).to.throw(expectedError);
      expect(callCreate('hello')).to.throw(expectedError);
      expect(callCreate('')).to.throw(expectedError);
      expect(callCreate([], [])).to.throw(expectedError);
      expect(callCreate(new Date())).to.throw(expectedError);
      expect(callCreate(/regex/)).to.throw(expectedError);

      done();
    });

    it.skip('should throw an error if called with invalid plugins', function (done) {
      var expectedError = 'Invalid arguments. Expected an array of plugins.';

      expect(callCreate(null, 0)).to.throw(expectedError);
      expect(callCreate(null, 12345)).to.throw(expectedError);
      expect(callCreate(null, Infinity)).to.throw(expectedError);
      expect(callCreate(null, NaN)).to.throw(expectedError);
      expect(callCreate(null, true)).to.throw(expectedError);
      expect(callCreate(null, false)).to.throw(expectedError);
      expect(callCreate(null, 'hello')).to.throw(expectedError);
      expect(callCreate(null, '')).to.throw(expectedError);
      expect(callCreate(null, {})).to.throw(expectedError);
      expect(callCreate(null, new Date())).to.throw(expectedError);
      expect(callCreate(null, /regex/)).to.throw(expectedError);

      done();
    });

  });

  function callCreate () {
    var args = arguments;
    return function () {
      jsonSchemaLib.create.apply(jsonSchemaLib, args);
    };
  }

}());

