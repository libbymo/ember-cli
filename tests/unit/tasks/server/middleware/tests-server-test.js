'use strict';

var expect            = require('chai').expect;
var TestsServerAddon  = require('../../../../../lib/tasks/server/middleware/tests-server');
var Promise           = require('../../../../../lib/ext/promise');

describe('TestServerAddon', function () {
  describe('.serverMiddleware', function () {
    var addon = new TestsServerAddon();
    var nextWasCalled = false;
    var mockRequest = {
      method: 'GET',
      path: '',
      url: 'http://example.com',
      headers: {}
    };
    var app = {
      use: function (callback) {
        return callback(mockRequest, null, function () { nextWasCalled = true; });
      }
    };

    it('invokes next when the watcher succeeds', function() {
      return addon.serverMiddleware({
        app: app,
        options: {
          watcher: Promise.resolve()
        }
      }).finally(function () {
        expect(nextWasCalled).to.true;
      });
    });

    it('invokes next when the watcher fails', function () {
      var mockError = 'bad things are bad';

      return addon.serverMiddleware({
        app: app,
        options: {
          watcher: Promise.reject(mockError)
        }
      }).catch(function (error) {
        expect(error).to.equal(mockError);
      }).finally(function () {
        expect(nextWasCalled).to.true;
      });
    });
  });
});
