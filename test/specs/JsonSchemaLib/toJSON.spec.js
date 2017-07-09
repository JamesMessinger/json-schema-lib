(function () {
  'use strict';

  describe('JsonSchemaLib.toJSON()', function () {

    it('should serialize the default instance', function (done) {
      var json = JSON.parse(JSON.stringify(jsonSchemaLib));
      var defaultConfig = JSON.parse(JSON.stringify(helpers.getDefaultConfig()));
      var defaultPlugins = JSON.parse(JSON.stringify(helpers.getDefaultPlugins()));

      expect(json).to.deep.equal({
        config: defaultConfig,
        plugins: defaultPlugins,
      });

      done();
    });

    it('should serialize a custom instance', function (done) {
      var instance = jsonSchemaLib.create();
      var json = JSON.parse(JSON.stringify(instance));
      var defaultConfig = JSON.parse(JSON.stringify(helpers.getDefaultConfig()));
      var defaultPlugins = JSON.parse(JSON.stringify(helpers.getDefaultPlugins()));

      expect(json).to.deep.equal({
        config: defaultConfig,
        plugins: defaultPlugins,
      });

      done();
    });

    it('should serialize a custom instance with custom plugins', function (done) {
      var plugin1 = { name: 'Plugin1', foo: 'bar' };
      var plugin2 = { name: 'Plugin2', priority: 1000, fizz: 'buzz' };
      var defaultConfig = JSON.parse(JSON.stringify(helpers.getDefaultConfig()));

      var instance = jsonSchemaLib.create({}, [plugin1]);
      instance.use(plugin2);

      var json = JSON.parse(JSON.stringify(instance));

      expect(json).to.deep.equal({
        config: defaultConfig,
        plugins: [plugin1, plugin2],
      });

      done();
    });

  });
}());
