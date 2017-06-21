(function () {
  'use strict';

  var assert = host.global.assert = host.global.assert || {};

  /**
   * Asserts that the given {@link Schema} object is well-formed and complies
   * with all the expectations for a schema object.
   *
   * @param {Schema} schema
   */
  assert.validSchema = function validSchema (schema) {
    expect(schema).to.be.an('object').and.ok;
    expect(schema).to.have.property('files').that.is.an('array');
    expect(schema).to.have.property('circular').that.is.a('boolean');
    expect(schema).to.have.property('root');
    expect(schema).to.have.property('rootUrl');
    expect(schema).to.have.property('rootFile');

    if (schema.files.length === 0) {
      expect(schema.root).to.be.null;
      expect(schema.rootUrl).to.be.null;
      expect(schema.rootFile).to.be.null;
    }
    else {
      expect(schema.root).to.be.an('object').and.not.null;
      expect(schema.root).to.equal(schema.files[0].data);
      expect(schema.rootUrl).to.be.a('string').and.not.null;
      expect(schema.rootUrl).to.equal(schema.files[0].url);
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
    expect(file).to.have.property('url').that.is.a('string').with.length.above(0);
    expect(file).to.have.property('urlType').that.is.a('string').with.length.above(0);
    expect(file).to.have.property('path').that.is.a('string').with.length.above(0);
    expect(file).to.have.property('extension').that.is.a('string').with.length.above(0);
    expect(file).to.have.property('data');
    expect(file).to.have.property('dataType').that.is.a('string').with.length.above(0);
    expect(file).to.have.property('parsed').that.is.a('boolean');
    expect(file).to.have.property('dereferenced').that.is.a('boolean');

    expect(file.extension).to.match(/^\.[a-z]+/);  // lowercase and start with a dot

    if (host.browser) {
      expect(file.urlType).not.to.equal('file');
    }

    if (file.urlType === 'http') {
      expect(file.url).to.match(/^https?\:\/\//);
      expect(file.path).to.match(/^https?\:\/\//);
    }
    else if (file.urlType === 'file') {
      expect(file.url).to.match(/^[^ \#\?]+$/);       // enocded path (no spaces, hashes, question marks, etc.)
      expect(file.path).to.match(/^(\/|[A-Z]\:\\)/);  // POSIX or Windows path
    }
  };

}());
