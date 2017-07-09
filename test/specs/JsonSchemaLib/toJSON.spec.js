(function () {
  'use strict';

  var defaultConfig = {
    http: {
      headers: {},
      maxRedirects: 5,
      timeout: 5000,
      withCredentials: false,
    }
  };

  var defaultPlugins = host.node
    ? [
      { name: 'NodeUrlPlugin', priority: 20 },
      { name: 'FileSystemPlugin', priority: 10 },
      { name: 'HttpPlugin', priority: 5 },
      { name: 'BufferDecoderPlugin', priority: 10 },
      { name: 'ArrayDecoderPlugin', priority: 5 },
      { name: 'JsonPlugin', priority: 20 },
    ]
    : [
      { name: 'BrowserUrlPlugin', priority: 20 },
      { name: 'XMLHttpRequestPlugin', priority: 5 },
      { name: 'TextDecoderPlugin', priority: 10 },
      { name: 'ArrayDecoderPlugin', priority: 5 },
      { name: 'JsonPlugin', priority: 20 },
    ];

  describe('JsonSchemaLib.toJSON()', function () {

    it('should serialize the default instance', function (done) {
      var json = JSON.parse(JSON.stringify(jsonSchemaLib));

      expect(json).to.deep.equal({
        config: defaultConfig,
        plugins: defaultPlugins,
      });

      done();
    });

    it('should serialize a custom instance', function (done) {
      var instance = jsonSchemaLib.create();
      var json = JSON.parse(JSON.stringify(instance));

      expect(json).to.deep.equal({
        config: defaultConfig,
        plugins: defaultPlugins,
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
        config: defaultConfig,
        plugins: [plugin1, plugin2],
      });

      done();
    });

  });
}());
