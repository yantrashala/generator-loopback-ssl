'use strict';

const Generator = require('yeoman-generator');
const debug = require('debug')('generator-loopback-ssl:index');
const yosay = require('yosay');
const chalk = require('chalk');
const _util = require('../../lib/utility.js');
const path = require('path');
const _ = require('lodash');
const extend = _.merge;
const timestamp = require('timestamp');

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
      debug('Project Name;', this.pkg.name);
      return Promise.resolve();
    }

    return ({
      name: 'name',
      message: 'Project Name:',
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
      message: 'LoopBack version:',
      choices: ['2.x', '3.x'],
      default: '2.x'
    }, {
      type: 'input',
      name: 'configFile',
      message: 'Loopback configuration file to update (server folder)',
      default: 'config.json'
    }, {
      type: 'list',
      name: 'httpMode',
      message: 'Select loopback-ssl configuration option:',
      choices: [{
        value: 'option1',
        name: 'Option 1: HTTP : Default loopback configuration'
      }, {
        value: 'option2',
        name: 'Option 2: HTTPS: Loading certificates from files'
      }, {
        value: 'option3',
        name: 'Option 3: HTTPS: Loading certificates from files & Mutual SSL authentication'
      }]
    }, {
      when: function (response) {
        return (response.httpMode !== 'option1');
      },
      type: 'input',
      name: 'certificatePath',
      message: 'Certificate path:',
      default: this.destinationPath('./certs/')
    }, {
      when: function (response) {
        return (response.httpMode !== 'option1');
      },
      type: 'input',
      name: 'privateKey',
      message: 'Private Key:',
      default: 'key.pem'
    }, {
      when: function (response) {
        return (response.httpMode !== 'option1');
      },
      type: 'input',
      name: 'certificate',
      message: 'Certificate:',
      default: 'cert.pem'
    }, {
      when: function (response) {
        return (response.httpMode !== 'option1');
      },
      type: 'confirm',
      name: 'genCerts',
      message: 'Do you want to generate certificates?',
      default: true
    }, {
      when: function (response) {
        return (response.httpMode !== 'option1' && response.genCerts === true);
      },
      type: 'input',
      name: 'certDuration',
      message: 'Validity of self signed certificate (whole number between 0 and 365):',
      default: 365,
      validate: function (input) {
        if (isNaN(input)) {
          return 'Only whole numbers allowed between 1 and 365';
        }
        var num = parseInt(input, 0);

        if (num % 1 !== 0) {
          return 'Only whole numbers allowed between 1 and 365';
        } else if (num < 1 || num > 365) {
          return 'Only whole numbers allowed between 1 and 365';
        }
        return true;
      }
    }, {
      when: function (response) {
        return (response.httpMode !== 'option1' && response.genCerts === true);
      },
      type: 'input',
      name: 'certHost',
      message: 'Hostname for the application:',
      default: 'localhost'
    }, {
      when: function (response) {
        return (response.httpMode === 'option3');
      },
      type: 'input',
      name: 'clientCertificate',
      message: 'Client Certificate',
      default: 'client-cert.pem'
    }, {
      type: 'confirm',
      name: 'confirmSetup',
      message: function (message) {
        return _util.confirmSetupCaption(message);
      }
    }];

    return this.prompt(prompts).then(props => {
      this.props = extend(this.props, props);
      debug('this.props=', this.props);
    });
  }

  prompting() {
    _util.validateTargetPackage(this.pkg);
    console.log(yosay('Hello, and welcome to loopback-ssl generator!'));
    return this._askForModuleName()
      .then(this._askFor.bind(this));
  }

  writing() {
    if (this.props.confirmSetup === true) {
      _util.validateTargetPackage(this.pkg);
      const pkg = _util.addLoopbackSSLDependency(this.pkg);
      debug('Target Package: ', pkg);

      _util.validateTargetConfigFile(this.destinationPath('server/' + this.props.configFile));
      const currentConfig = this.fs.readJSON(this.destinationPath('server/' + this.props.configFile), {});
      const targetConfig = _util.addLoopbackSSLConfig(currentConfig, this.props);
      debug('Target Config: ', targetConfig);

      if (this.props.genCerts) {
        _util.genCerts(this.props.certificatePath,
          this.props.privateKey,
          this.props.certificate,
          this.props.certDuration,
          this.props.certHost);
      }

      this.fs.copy(
        this.destinationPath('server/server.js'),
        this.destinationPath('server/_backup_' + timestamp() + '_server.js')
      );
      this.fs.copy(
        this.destinationPath('server/' + this.props.configFile),
        this.destinationPath('server/_backup_' + timestamp() + '_' + this.props.configFile)
      );

      this.fs.copy(
        this.templatePath('server/server.js'),
        this.destinationPath('server/server.js')
      );
      this.fs.writeJSON(this.destinationPath('package.json'), pkg);
      this.fs.writeJSON(this.destinationPath('server/' + this.props.configFile), targetConfig);
    }
  }

  installing() {
    if (this.props.confirmSetup === true) {
      this.npmInstall();
    }
  }

  end() {
    if (this.props.confirmSetup === true) {
      this.log(chalk.green.bold('  Thanks for using loopback-ssl generator!'));
    } else {
      this.log(chalk.yellow.bold('  loopback-ssl generator did not run'));
    }

    debug(this.props);
  }
};
