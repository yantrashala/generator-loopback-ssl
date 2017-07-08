'use strict';

const Generator = require('yeoman-generator');
const debug = require('debug')('loopback-ssl:index');
const yosay = require('yosay');
// Const chalk = require('chalk');
const _util = require('../../lib/utility.js');
// Const parseAuthor = require('parse-author');
// const githubUsername = require('github-username');
const path = require('path');
// Const askName = require('inquirer-npm-name');
// const pkg = require('../../package.json');
const _ = require('lodash');
const extend = _.merge;
// Const pkgJson = require('../../package.json');

module.exports = class extends Generator {
  initializing() {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    this.props = {
      name: this.pkg.name,
      description: this.pkg.description,
      version: this.pkg.version,
      homepage: this.pkg.homepage
    };
  }

  _askForModuleName() {
    if (this.pkg.name || this.options.name) {
      this.props.name = this.pkg.name || _.kebabCase(this.options.name);
      debug('Package Name;', this.pkg.name);
      return Promise.resolve();
    }

    return ({
      name: 'name',
      message: 'Module Name',
      default: path.basename(process.cwd()),
      filter: _.kebabCase,
      validate(str) {
        return str.length > 0;
      }
    }, this).then(answer => {
      this.props.name = answer.name;
    });
  }

  _askFor() {
    const prompts = [{
      type: 'list',
      name: 'loopbackVersion',
      message: 'Select loopback version',
      choices: ['2.x', '3.x'],
      default: '2.x'
    }, {
      type: 'list',
      name: 'httpMode',
      message: 'Select HTTP mode',
      choices: [{
        value: 'option1',
        name: 'Option 1: HTTP : Default loopback configuration'
      }, {
        value: 'option2',
        name: 'Option 2: HTTPS: Loading certificates from file'
      }, {
        value: 'option3',
        name: 'Option 3: HTTPS: Generating Certificates at runtime'
      }, {
        value: 'option4',
        name: 'Option 4: HTTPS: Mutual SSL authentication'
      }]
    }, {
      when: function (response) {
        return ((response.httpMode !== 'option1') &&
          (response.httpMode !== 'option3'));
      },
      type: 'input',
      name: 'certificatePath',
      message: 'Provide certificate path',
      default: '/certificate/path/'
    }, {
      when: function (response) {
        return ((response.httpMode !== 'option1') &&
          (response.httpMode !== 'option3'));
      },
      type: 'input',
      name: 'privateKey',
      message: 'Private Key',
      default: 'key.pem'
    }, {
      when: function (response) {
        return ((response.httpMode !== 'option1') &&
          (response.httpMode !== 'option3'));
      },
      type: 'input',
      name: 'certificate',
      message: 'Certificate',
      default: 'cert.pem'
    }, {
      when: function (response) {
        return ((response.httpMode !== 'option1') &&
          (response.httpMode !== 'option3') &&
          (response.httpMode === 'option2'));
      },
      type: 'confirm',
      name: 'generateCertificate',
      message: 'Do you want to generate self signed certificates?',
      default: false
    }, {
      when: function (response) {
        return ((response.httpMode !== 'option1') &&
          (response.httpMode !== 'option3') &&
          (response.httpMode === 'option4'));
      },
      type: 'input',
      name: 'clientCertificate',
      message: 'Client Certificate',
      default: 'client-cert.pem'
    }, {
      type: 'confirm',
      name: 'confirmSetup',
      message: 'Do you want to continue with the above settings?',
      default: true
    }];

    return this.prompt(prompts).then(props => {
      this.props = extend(this.props, props);
      debug(this.props);
    });
  }

  prompting() {
    _util.validateTarget(this.pkg);

    console.log(yosay('Hello, and welcome to loopback-ssl generator!'));

    return this._askForModuleName()
      .then(this._askFor.bind(this));
  }

  writing() {
    this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );
  }
};
