(function () {
  'use strict';

  scenarios.forEach(function (scenario) {
    describe('JsonSchemaLib.' + scenario.name, function () {

      it('should throw an error if called without any arguments', function (done) {
        scenario.read(null, [], function (err, schema) {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('Invalid arguments. Expected at least a URL or schema.');
          expect(schema).to.be.undefined;
          done();
        });
      });

    });
  });
}());
