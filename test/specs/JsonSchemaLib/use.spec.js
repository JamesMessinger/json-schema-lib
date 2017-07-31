(function () {
  'use strict';

  describe('JsonSchemaLib.use()', function () {

    // Create dummy plugins for each test
    var myPlugin1, myPlugin2, myPlugin3;
    beforeEach(function () {
      myPlugin1 = {
        name: 'My Plugin 1',
        priority: 1001,
        resolveURL: helpers.pluginMethods.passThrough(),
        readFileSync: helpers.pluginMethods.passThrough(),
        decodeFile: helpers.pluginMethods.passThrough(),
        parseFile: helpers.pluginMethods.passThrough(),
      };

      myPlugin2 = {
        name: 'My Plugin 2',
        priority: 1002,
        resolveURL: helpers.pluginMethods.passThrough(),
        readFileSync: helpers.pluginMethods.passThrough(),
        decodeFile: helpers.pluginMethods.passThrough(),
        parseFile: helpers.pluginMethods.passThrough(),
      };

      myPlugin3 = {
        name: 'My Plugin 3',
        priority: 1003,
        resolveURL: helpers.pluginMethods.passThrough(),
        readFileSync: helpers.pluginMethods.passThrough(),
        decodeFile: helpers.pluginMethods.passThrough(),
        parseFile: helpers.pluginMethods.passThrough(),
      };
    });

    it('adds a new plugin', function (done) {
      // The instance starts-out with the default plugins
      var instance = jsonSchemaLib.create();
      expect(instance.plugins).to.deep.equal(helpers.getDefaultPlugins());

      // Add myPlugin, in addition to the default plugins
      instance.use(myPlugin1);
      expect(instance.plugins).to.deep.equal(helpers.getDefaultPlugins().concat(myPlugin1));

      // Each of myPlugin's methods should be called once
      var schema = instance.readSync(path.rel('schemas/no-refs.json'));
      sinon.assert.calledOnce(myPlugin1.resolveURL);
      sinon.assert.calledOnce(myPlugin1.readFileSync);
      sinon.assert.calledOnce(myPlugin1.decodeFile);
      sinon.assert.calledOnce(myPlugin1.parseFile);

      // myPlugin should be the first plugin (sorted by priority)
      expect(schema.plugins).to.deep.equal([myPlugin1].concat(helpers.getDefaultPlugins(true)));

      done();
    });

    it('adds multiple plugins ', function (done) {
      // The instance starts-out with the default plugins
      var instance = jsonSchemaLib.create();
      expect(instance.plugins).to.deep.equal(helpers.getDefaultPlugins());

      // Add myPlugins, in addition to the default plugins
      instance.use(myPlugin1);
      instance.use(myPlugin2);
      instance.use(myPlugin3);
      expect(instance.plugins).to.deep.equal(
        helpers.getDefaultPlugins().concat([myPlugin1, myPlugin2, myPlugin3])
      );

      // Each of myPlugin's methods should be called once
      var schema = instance.readSync(path.rel('schemas/no-refs.json'));
      sinon.assert.calledOnce(myPlugin1.resolveURL);
      sinon.assert.calledOnce(myPlugin1.readFileSync);
      sinon.assert.calledOnce(myPlugin1.decodeFile);
      sinon.assert.calledOnce(myPlugin1.parseFile);

      sinon.assert.calledOnce(myPlugin2.resolveURL);
      sinon.assert.calledOnce(myPlugin2.readFileSync);
      sinon.assert.calledOnce(myPlugin2.decodeFile);
      sinon.assert.calledOnce(myPlugin2.parseFile);

      sinon.assert.calledOnce(myPlugin3.resolveURL);
      sinon.assert.calledOnce(myPlugin3.readFileSync);
      sinon.assert.calledOnce(myPlugin3.decodeFile);
      sinon.assert.calledOnce(myPlugin3.parseFile);

      // myPlugins should be the first plugins (sorted by priority)
      expect(schema.plugins).to.deep.equal(
        [myPlugin3, myPlugin2, myPlugin1].concat(helpers.getDefaultPlugins(true))
      );

      done();
    });

    it('adds the same plugin multiple times', function (done) {
      // The instance starts-out with the default plugins
      var instance = jsonSchemaLib.create();
      expect(instance.plugins).to.deep.equal(helpers.getDefaultPlugins());

      // Add myPlugins, in addition to the default plugins
      instance.use(myPlugin1);
      instance.use(myPlugin1);
      instance.use(myPlugin1);
      expect(instance.plugins).to.deep.equal(
        helpers.getDefaultPlugins().concat([myPlugin1, myPlugin1, myPlugin1])
      );

      // Each of myPlugin's methods should be called three times
      var schema = instance.readSync(path.rel('schemas/no-refs.json'));
      sinon.assert.calledThrice(myPlugin1.resolveURL);
      sinon.assert.calledThrice(myPlugin1.readFileSync);
      sinon.assert.calledThrice(myPlugin1.decodeFile);
      sinon.assert.calledThrice(myPlugin1.parseFile);

      // myPlugins should be the first plugins (sorted by priority)
      expect(schema.plugins).to.deep.equal(
        [myPlugin1, myPlugin1, myPlugin1].concat(helpers.getDefaultPlugins(true))
      );

      done();
    });

    it("can override the plugin's default priority", function (done) {
      var instance = jsonSchemaLib.create();

      // Add myPlugins, but switch their priorities
      instance.use(myPlugin1, 8888);
      instance.use(myPlugin2, 7777);
      instance.use(myPlugin3, 9999);

      // Verify that the custom priorities were used instad of the default priorities.
      // NOTE: The plugins are not sorted yet
      expect(instance.plugins[instance.plugins.length - 3]).to.have.property('name', 'My Plugin 1');
      expect(instance.plugins[instance.plugins.length - 3]).to.have.property('priority', 8888);
      expect(instance.plugins[instance.plugins.length - 2]).to.have.property('name', 'My Plugin 2');
      expect(instance.plugins[instance.plugins.length - 2]).to.have.property('priority', 7777);
      expect(instance.plugins[instance.plugins.length - 1]).to.have.property('name', 'My Plugin 3');
      expect(instance.plugins[instance.plugins.length - 1]).to.have.property('priority', 9999);

      // Verify that the plugins were called in the right order
      var schema = instance.readSync(path.rel('schemas/no-refs.json'));
      sinon.assert.callOrder(myPlugin3.resolveURL, myPlugin1.resolveURL, myPlugin2.resolveURL);
      sinon.assert.callOrder(myPlugin3.readFileSync, myPlugin1.readFileSync, myPlugin2.readFileSync);
      sinon.assert.callOrder(myPlugin3.decodeFile, myPlugin1.decodeFile, myPlugin2.decodeFile);
      sinon.assert.callOrder(myPlugin3.parseFile, myPlugin1.parseFile, myPlugin2.parseFile);

      // Verify that the plugins were sorted by their custom priorities
      expect(schema.plugins[0]).to.have.property('name', 'My Plugin 3');
      expect(schema.plugins[0]).to.have.property('priority', 9999);
      expect(schema.plugins[1]).to.have.property('name', 'My Plugin 1');
      expect(schema.plugins[1]).to.have.property('priority', 8888);
      expect(schema.plugins[2]).to.have.property('name', 'My Plugin 2');
      expect(schema.plugins[2]).to.have.property('priority', 7777);

      done();
    });

    it('cannot add multiple plugins simultaneously', function (done) {
      // Attempt to add multiple plugins simultaneously
      function tryToUseMultiplePlugins () {
        var instance = jsonSchemaLib.create();
        instance.use(myPlugin1, myPlugin2, myPlugin3);
      }

      expect(tryToUseMultiplePlugins).to.throw(/Invalid arguments\. Expected a priority number\./);
      done();
    });

    it('cannot be called as a standalone function', function (done) {
      function tryToCallAsStandaloneFunction (use) {
        return function () {
          use({ name: 'MyDummyPlugin' });
        };
      }

      // Default instance
      expect(tryToCallAsStandaloneFunction(jsonSchemaLib.use)).to.throw(/undefined/);

      // Custom instance
      var instance = jsonSchemaLib.create();
      expect(tryToCallAsStandaloneFunction(instance.use)).to.throw(/undefined/);

      done();
    });

    it('throws an error if called with an invalid plugin', function (done) {
      var expectedError = 'Invalid arguments. Expected a plugin object.';

      expect(callUse(12345)).to.throw(expectedError);
      expect(callUse(0)).to.throw(expectedError);
      expect(callUse(NaN)).to.throw(expectedError);
      expect(callUse(true)).to.throw(expectedError);
      expect(callUse(false)).to.throw(expectedError);
      expect(callUse('hello')).to.throw(expectedError);
      expect(callUse('')).to.throw(expectedError);
      expect(callUse([])).to.throw(expectedError);
      expect(callUse(new Date())).to.throw(expectedError);
      expect(callUse(/regex/)).to.throw(expectedError);

      done();
    });

    it('throws an error if called with an invalid priority', function (done) {
      var expectedError = 'Invalid arguments. Expected a priority number.';

      expect(callUse({}, NaN)).to.throw(expectedError);
      expect(callUse({}, true)).to.throw(expectedError);
      expect(callUse({}, false)).to.throw(expectedError);
      expect(callUse({}, 'hello')).to.throw(expectedError);
      expect(callUse({}, '')).to.throw(expectedError);
      expect(callUse({}, [])).to.throw(expectedError);
      expect(callUse({}, new Date())).to.throw(expectedError);
      expect(callUse({}, /regex/)).to.throw(expectedError);

      done();
    });

    function callUse () {
      var args = arguments;
      return function () {
        var instance = jsonSchemaLib.create();
        instance.use.apply(instance, args);
      };
    }

  });
}());
