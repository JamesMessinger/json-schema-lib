(function () {
  'use strict';

  var httpUrlPattern = /^https?\:\/\//;
  var fileUrlPattern = /^file\:\/\//;
  var filesystemPattern = process.platform === 'win32' ? /^[A-Z]\:\\/ : /^\//;

  var assert = host.global.assert = host.global.assert || {};

  /**
   * Asserts that the given {@link Schema} object is well-formed and complies
   * with all the expectations for a schema object.
   *
   * @param {Schema} schema
   */
  assert.validSchema = function validSchema (schema) {
    expect(schema).to.be.an('object').and.ok;
    expect(schema).to.have.property('config').that.is.an('object');
    expect(schema).to.have.property('plugins').that.is.an('array');
    expect(schema).to.have.property('files').that.is.an('array');
    expect(schema).to.have.property('root');
    expect(schema).to.have.property('rootURL');
    expect(schema).to.have.property('rootFile');

    if (schema.files.length === 0) {
      expect(schema.root).to.be.null;
      expect(schema.rootURL).to.be.null;
      expect(schema.rootFile).to.be.null;
    }
    else {
      expect(schema.root).to.be.an('object').and.not.null;
      expect(schema.root).to.equal(schema.files[0].data);
      expect(schema.rootURL).to.be.a('string');
      expect(schema.rootURL).to.equal(schema.files[0].url);
      expect(schema.rootFile).to.be.an('object').and.not.null;
      expect(schema.rootFile).to.equal(schema.files[0]);
    }
  };

  /**
   * Asserts that the given {@link File} objects are well-formed and comply
   * with all the expectations for file objects.
   *
   * Also asserts that the array ONLY contains the expected file URLs.
   *
   * @param {FileArray} files
   * @param {string[]}  expectedUrls - An array of file paths
   */
  assert.validFiles = function validFiles (files, expectedUrls) {
    expect(files).to.be.an('array');
    files.forEach(assert.validFile);

    var actualUrls = files.map(function (file) { return file.url; });

    try {
      expect(files).to.have.lengthOf(expectedUrls.length);
      expect(actualUrls).to.have.same.members(expectedUrls);
    }
    catch (e) {
      console.error('\nEXPECTED FILES:\n' + expectedUrls.join('\n'));
      console.error('\nACTUAL FILES:\n' + actualUrls.join('\n') + '\n');
      throw e;
    }
  };

  /**
   * Asserts that the given {@link File} object is well-formed and complies
   * with all the expectations for a file object.
   *
   * @param {File} file
   */
  assert.validFile = function validFile (file) {
    expect(file).to.be.an('object').and.ok;
    assert.validSchema(file.schema);
    expect(file).to.have.property('url').that.is.a('string');
    expect(file).to.have.property('data');
    expect(file).to.have.property('mimeType');
    expect(file).to.have.property('encoding');

    if (file.mimeType !== undefined) {
      expect(file.mimeType).to.be.a('string').and.match(/^[a-z]+\/[a-z]+(\+[a-z]+)?$/);
    }

    if (file.encoding !== undefined) {
      expect(file.encoding).to.be.a('string').and.match(/^[a-z]+(-[0-9]+)+$/);
    }

    if (file.url !== '') {
      if (host.browser) {
        expect(file.url).to.match(httpUrlPattern);
      }
      else {
        expect(file.url).to.satisfy(function (url) {
          return httpUrlPattern.test(url) ||
            fileUrlPattern.test(url) ||
            filesystemPattern.test(url);
        });
      }
    }
  };

}());
