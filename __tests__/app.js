'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-loopback-ssl:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({name: 'gen-test',
        description: '',
        version: '1.0.0',
        homepage: undefined,
        loopbackVersion: '2.x',
        httpMode: 'option2',
        certificatePath: '/certificate/path/',
        privateKey: 'key.pem',
        certificate: 'cert.pem',
        generateCertificate: false,
        confirmSetup: true});
  });

  it('creates files', () => {
    assert.file([
      'dummyfile.txt'
    ]);
  });
});
