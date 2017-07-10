(function () {
  'use strict';

  describe.skip('JsonSchemaLib.use()', function () {

    it('can add a new plugin, in addition to the default plugins', function (done) {
      var plugin = helper.createMockPlugin({
        name: 'My Plugin',
        priority: 1000,
      });

      var instance = jsonSchemaLib.create();
      instance.use(plugin);
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
