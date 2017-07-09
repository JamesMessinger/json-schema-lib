(function () {
  'use strict';

  describe('JsonSchemaLib.toJSON()', function () {

    it('should serialize the default instance', function (done) {
      var json = JSON.parse(JSON.stringify(jsonSchemaLib));

      expect(json).to.deep.equal({
        config: helpers.getDefaultConfig(),
        plugins: helpers.getDefaultPlugins(),
      });

      done();
    });

    it('should serialize a custom instance', function (done) {
      var instance = jsonSchemaLib.create();
      var json = JSON.parse(JSON.stringify(instance));

      expect(json).to.deep.equal({
        config: helpers.getDefaultConfig(),
        plugins: helpers.getDefaultPlugins(),
      });

      done();
    });

    it('should serialize a custom instance with custom plugins', function (done) {
      var plugin1 = { name: 'Plugin1', foo: 'bar' };
      var plugin2 = { name: 'Plugin2', priority: 1000, fizz: 'buzz' };

      var instance = jsonSchemaLib.create({}, [plugin1]);
      instance.use(plugin2);

      var json = JSON.parse(JSON.stringify(instance));

      expect(json).to.deep.equal({
        config: helpers.getDefaultConfig(),
        plugins: [plugin1, plugin2],
      });

      done();
    });

  });
}());
