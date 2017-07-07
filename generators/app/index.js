'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const parseAuthor = require('parse-author');
const githubUsername = require('github-username');
const path = require('path');
const askName = require('inquirer-npm-name');
const pkg = require('../../package.json');
const _ = require('lodash');
const promise = require("bluebird");
const pkgJson = require('../../package.json');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([{
      type    : 'list',
      name    : 'loopbackVersion',
      message : 'Select loopback version',
      choices : ['2.x', '3.x'],
      default : '3.x'
    }, {
      type    : 'list',
      name    : 'httpMode',
      message : 'Select HTTP mode',
      choices : [{
        value: 'option1',
        name: 'Option 1: HTTP: Default loopback configuration'
      },{
        value: 'option2',
        name: 'Option 2: HTTPS: Loading certificates at runtime'
      },{
        value: 'option3',
        name: 'Option 3: HTTPS: Generating Certificates at runtime'
      }]
    }, {
      when    : function(response) {
        return ((response.httpMode !== 'option1') && (response.httpMode !== 'option3'));
      },
      type    : 'input',
      name    : 'certificatePath',
      message : 'Provide certificate path',
      default : '/certificate/path/'
    }, {
      when    : function(response) {
        return ((response.httpMode !== 'option1') && (response.httpMode !== 'option3'));
      },
      type    : 'input',
      name    : 'privateKey',
      message : 'Provide key name',
      default : 'key.pem'
    }, {
      when    : function(response) {
        return ((response.httpMode !== 'option1') && (response.httpMode !== 'option3'));
      },
      type    : 'input',
      name    : 'certificate',
      message : 'Certificate name',
      default : 'cert.pem'
    }]).then((answers) => {
      this.log('loopback version', answers.loopbackVersion);
      this.log('httpMode', answers.httpMode);
      this.log('certificate path', answers.certificatePath);
      this.log('certificate path', answers.privateKey);
    });
  }
};
