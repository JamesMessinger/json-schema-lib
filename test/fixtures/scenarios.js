(function () {
  'use strict';

  /**
   * These scenarios allow us to test the same behavior across various combinations of
   * sync/async sytnax, filesystem/http transports, relative/absolute paths, etc.
   */
  var scenarios = [
    {
      name: 'readSync() (absolute paths)',
      path: path.abs,
      read: readSync,
    },
    {
      name: 'readAsync() (absolute paths, Promise syntax)',
      path: path.abs,
      read: readPromise,
    },
    {
      name: 'readAsync() (absolute paths, Callback syntax)',
      path: path.abs,
      read: readCallback,
    },
    {
      name: 'readSync() (relative paths)',
      path: path.rel,
      read: readSync,
    },
    {
      name: 'readAsync() (relative paths, Promise syntax)',
      path: path.rel,
      read: readPromise,
    },
    {
      name: 'readAsync() (relative paths, Callback syntax)',
      path: path.rel,
      read: readCallback,
    },
  ];

  if (host.node) {
    scenarios.push(
      {
        name: 'readSync() (file:// paths)',
        path: path.fileURL,
        read: readSync,
      },
      {
        name: 'readAsync() (file:// paths, Promise syntax)',
        path: path.fileURL,
        read: readPromise,
      },
      {
        name: 'readAsync() (file:// paths, Callback syntax)',
        path: path.fileURL,
        read: readCallback,
      },
      {
        name: 'readSync() (http:// paths)',
        path: path.httpURL,
        read: readSync,
      },
      {
        name: 'readAsync() (http:// paths, Promise syntax)',
        path: path.httpURL,
        read: readPromise,
      },
      {
        name: 'readAsync() (http:// paths, Callback syntax)',
        path: path.httpURL,
        read: readCallback,
      }
    );
  }

  // Allow "only: true" for debugging purposes
  var only = scenarios.filter(function (scenario) { return scenario.only; })[0];
  if (only) {
    host.global.scenarios = [only];
  }
  else {
    host.global.scenarios = scenarios;
  }

  /**
   * Calls {@link JsonSchemaLib#readSync} synchronously
   */
  function readSync (context, args, done) {
    var error = null, result;

    try {
      var fn = context ? context.readSync : jsonSchemaLib.readSync;
      result = fn.apply(context, args);
    }
    catch (err) {
      error = err;
    }

    done(error, result);
  }

  /**
   * Calls {@link JsonSchemaLib#readAsync} using callback syntax
   */
  function readCallback (context, args, done) {
    var fn = context ? context.readAsync : jsonSchemaLib.readAsync;
    fn.apply(context, args.concat(done));
  }

  /**
   * Calls {@link JsonSchemaLib#readAsync} using ES6 Promise syntax
   */
  function readPromise (context, args, done) {
    var fn = context ? context.readAsync : jsonSchemaLib.readAsync;
    fn.apply(context, args).then(
      function (result) {
        done(null, result);
      },
      function (error) {
        done(error);
      }
    );
  }

}());
