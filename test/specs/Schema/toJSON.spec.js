(function () {
  'use strict';

  describe('Schema.toJSON()', function () {

    it('should serialize a schema with default config and plugins', function (done) {
      var schema = jsonSchemaLib.readSync(path.rel('schemas/no-refs.json'));
      var json = JSON.parse(JSON.stringify(schema));

      expect(json).to.deep.equal({
        config: helpers.getDefaultConfig(),
        plugins: helpers.getDefaultPlugins(),
        files: [{
          url: schema.files[0].url,
          mimeType: schema.files[0].mimeType,
          encoding: schema.files[0].encoding,
          data: schema.files[0].data,
        }],
      });

      done();
    });

    it('should serialize a schema with custom plugins', function (done) {
      var plugin1 = { name: 'Plugin1', foo: 'bar' };
      var plugin2 = { name: 'Plugin2', priority: 1000, fizz: 'buzz' };

      var instance = jsonSchemaLib.create();
      instance.use(plugin1);
      instance.use(plugin2);

      var schema = instance.readSync(path.rel('schemas/no-refs.json'));
      var json = JSON.parse(JSON.stringify(schema));

      expect(json).to.deep.equal({
        config: helpers.getDefaultConfig(),
        plugins: [plugin2].concat(helpers.getDefaultPlugins()).concat(plugin1),
        files: [{
          url: schema.files[0].url,
          mimeType: schema.files[0].mimeType,
          encoding: schema.files[0].encoding,
          data: schema.files[0].data,
        }],
      });

      done();
    });

    it('should serialize a schema with multiple files', function (done) {
      var schema = jsonSchemaLib.readSync(path.rel('schemas/external-refs-multiple/vehicle.json'));
      var json = JSON.parse(JSON.stringify(schema));

      expect(json).to.deep.equal({
        config: helpers.getDefaultConfig(),
        plugins: helpers.getDefaultPlugins(),
        files: schema.files.map(function (file) {
          return {
            url: file.url,
            mimeType: file.mimeType,
            encoding: file.encoding,
            data: file.data,
          };
        }),
      });

      done();
    });

  });
}());
