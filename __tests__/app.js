'use strict';

var path = require('path');
var yassert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs-extra');
const debug = require('debug')('generator-loopback-ssl:test');


describe('generator-loopback-ssl:app', function () {
  describe('loopback-version-2', function () {
    describe('scenario:option1', function () {
      beforeAll(() => {
        return helpers.run(path.join(__dirname, '../generators/app'))
          .inTmpDir(function (dir) {
            debug('Temp Dir:', dir)
            fs.copySync(path.join(__dirname, '../fixtures/loopback-2'), dir)
          }).withPrompts({name: 'loopback-2',
              description: 'loopback-2',
              version: '1.0.0',
              homepage: undefined,
              loopbackVersion: '2.x',
              configFile: 'config.json',
              httpMode: 'option1',
              confirmSetup: true
          });
      });
      it('config.json-exists', () => {
        yassert.file([
          'server/config.json'
        ]);
      });
      it('server.js-exists', () => {
        yassert.file([
          'server/server.js'
        ]);
      });
      it('config.json: {httpMode=true}', () => {
        yassert.jsonFileContent('server/config.json', {"httpMode": true});
      });
    });
  });
});
