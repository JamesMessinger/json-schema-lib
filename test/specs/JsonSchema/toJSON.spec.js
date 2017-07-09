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

  var defaultNodePlugins = [
    { name: 'NodeUrlPlugin', priority: 20 },
    { name: 'FileSystemPlugin', priority: 10 },
    { name: 'HttpPlugin', priority: 5 },
    { name: 'BufferDecoderPlugin', priority: 10 },
    { name: 'ArrayDecoderPlugin', priority: 5 },
    { name: 'JsonPlugin', priority: 20 },
  ];

  var defaultBrowserPlugins = [
    { name: 'BrowserUrlPlugin', priority: 20 },
    { name: 'XMLHttpRequestPlugin', priority: 5 },
    { name: 'TextDecoderPlugin', priority: 10 },
    { name: 'ArrayDecoderPlugin', priority: 5 },
    { name: 'JsonPlugin', priority: 20 },
  ];

  describe('Schema.toJSON()', function () {

    it('should serialize a schema with default config and plugins', function (done) {
      var json = JSON.parse(JSON.stringify(jsonSchemaLib));

      expect(json).not.to.equal(jsonSchemaLib);
      expect(json).to.have.all.keys('config', 'plugins');
      expect(json.config).to.deep.equal(defaultConfig);
      expect(json.plugins).to.be.an('array');

      if (host.node) {
        expect(json.plugins).to.deep.equal(defaultNodePlugins);
      }
      else {
        expect(json.plugins).to.deep.equal(defaultBrowserPlugins);
      }

      done();
    });

    // it('should serialize a custom instance', function (done) {
    //   var instance = jsonSchemaLib.create();
    //   var json = JSON.parse(JSON.stringify(instance));

    //   expect(json).not.to.equal(jsonSchemaLib);
    //   expect(json).to.have.all.keys('config', 'plugins');
    //   expect(json.config).to.deep.equal(defaultConfig);
    //   expect(json.plugins).to.be.an('array');

    //   if (host.node) {
    //     expect(json.plugins).to.deep.equal(defaultNodePlugins);
    //   }
    //   else {
    //     expect(json.plugins).to.deep.equal(defaultBrowserPlugins);
    //   }

    //   done();
    // });

    // it('should serialize a custom instance with custom plugins', function (done) {
    //   var plugin1 = { name: 'Plugin1', foo: 'bar' };
    //   var plugin2 = { name: 'Plugin2', priority: 1000, fizz: 'buzz' };

    //   var instance = jsonSchemaLib.create({}, [plugin1]);
    //   instance.use(plugin2);

    //   var json = JSON.parse(JSON.stringify(instance));

    //   expect(json).not.to.equal(jsonSchemaLib);
    //   expect(json).to.have.all.keys('config', 'plugins');
    //   expect(json.config).to.deep.equal(defaultConfig);
    //   expect(json.plugins).to.be.an('array');
    //   expect(json.plugins).to.deep.equal([plugin1, plugin2]);

    //   done();
    // });

  });
}());
