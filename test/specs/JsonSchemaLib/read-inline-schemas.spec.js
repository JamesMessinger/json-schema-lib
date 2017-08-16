(function () {
  'use strict';

  describe.only('inline schemas', function () {
    scenarios.forEach(function (scenario) {
      describe('JsonSchemaLib.' + scenario.name, function () {

        it('should read an inline schema without any $refs', function (done) {
          var pojo = {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              }
            }
          };
          var json = JSON.stringify(pojo);

          scenario.read(null, [json], function (err, schema) {
            expect(err).to.be.null;
            assert.validSchema(schema);

            assert.validFile(schema.rootFile);
            expect(schema.files).to.have.lengthOf(1);
            expect(schema.rootURL).to.equal('');
            expect(schema.root).to.deep.equal(pojo);

            done();
          });
        });

        it('should read an inline schema with a URL', function (done) {
          var pojo = {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              }
            }
          };
          var json = JSON.stringify(pojo);
          var url = scenario.path('my/fake/schema/path');

          scenario.read(null, [url, json], function (err, schema) {
            expect(err).to.be.null;
            assert.validSchema(schema);
            expect(schema.files).to.have.lengthOf(1);
            assert.validFile(schema.rootFile);
            expect(schema.rootURL).to.equal(scenario.path.abs('my/fake/schema/path'));
            done();
          });
        });

      });
    });
  });
}());
