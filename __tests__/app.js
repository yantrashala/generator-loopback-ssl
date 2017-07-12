'use strict';

var path = require('path');
var yassert = require('yeoman-assert');
var helpers = require('yeoman-test');
var fs = require('fs-extra');

describe('generator-loopback-ssl:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .inTmpDir(function (dir) {
        fs.copySync(path.join(__dirname, './fixtures/loopback-2'), dir)
      }).withPrompts({name: 'gen-test',
        description: '',
        version: '1.0.0',
        homepage: undefined,
        loopbackVersion: '2.x',
        httpMode: 'option2',
        certificatePath: '/certificate/path/',
        privateKey: 'key.pem',
        certificate: 'cert.pem',
        generateCertificate: false,
        confirmSetup: true
      });
  });

  it('creates files', () => {
    yassert.file([
      'dummyfile.txt'
    ]);
  });
});
