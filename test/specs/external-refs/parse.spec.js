(function () {
  'use strict';

  describe('Parsing a schema with external $refs', function () {

    it('should only parse the root file', function () {
      return JsonSchema.parse(path.abs('specs/external-refs/schema/vehicle.json'))
        .then(function (schema) {
          assert.validSchema(schema);

          // The schema should only contain the root file,
          // and the files that are directly referenced by the root file
          assert.validFiles(schema.files, [
            path.abs('specs/external-refs/schema/vehicle.json'),
            path.abs('specs/external-refs/schema/body.json'),
            path.abs('specs/external-refs/schema/drivetrain.json'),
          ]);
        });
    });

  });
}());
