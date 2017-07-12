'use strict';

const debug = require('debug')('generator-loopback-ssl:utility');
const chalk = require('chalk');
const emoji = require('node-emoji');
const _ = require('lodash');
const extend = _.merge;
const lbPkg = require('../package.json');
const fs = require('fs-extra');
const pem = require('pem-promise');

function validateTargetPackage(pkg) {
  debug('Target package name:', pkg.name);
  debug('Target package version:', pkg.version);

  if (pkg.dependencies) {
    debug('Target package Loopback version:', pkg.dependencies.loopback);
  }

  if (!(pkg.name && pkg.version)) {
    console.log(emoji.emojify(':no_entry: ') + chalk.red(' Invalid package.json at destination. (required package name and version)'));
    process.exit(-1);
  } else if (!(pkg.dependencies && pkg.dependencies.loopback)) {
    console.log(emoji.emojify(':no_entry: ') + chalk.red(' Dependency failed - target project does not have loopback-ssl installed '));
    process.exit(-1);
  } else if (pkg.dependencies && pkg.dependencies['lopback-ssl']) {
    console.log(emoji.emojify(':no_entry: ') + chalk.red(' loopback-ssl already installed'));
    process.exit(-1);
  }
}

function validateTargetConfigFile(configPath) {
  if (!fs.existsSync(configPath)) {
    console.log(emoji.emojify(':no_entry: ') + chalk.red(' Configuration file', configPath, 'does not exist'));
    process.exit(-1);
  }
}

function addLoopbackSSLDependency(targetPackage) {
  return extend(targetPackage, {
    dependencies: {
      'loopback-ssl': lbPkg.peerDependencies['loopback-ssl']
    }
  });
}

function addLoopbackSSLConfig(currentConfig, props) {
  if (currentConfig.httpMode) {
    delete currentConfig.httpMode;
  }

  if (currentConfig.certConfig) {
    delete currentConfig.certConfig;
  }

  const lbConfig = {
    httpMode: true,
    certConfig: {}
  };

  const lbCertConfig = {
    path: props.certificatePath,
    key: props.privateKey,
    cert: props.certificate,
    ca: [],
    requestCert: false,
    rejectUnauthorized: false
  };

  if (props.httpMode === 'option1') {
    // Do nothing
  } else if (props.httpMode === 'option2') {
    lbConfig.httpMode = false;
    lbConfig.certConfig = lbCertConfig;
  } else if (props.httpMode === 'option3') {
    lbConfig.httpMode = false;
    lbConfig.certConfig = lbCertConfig;
    lbConfig.certConfig.ca.push(props.clientCertificate);
  } else {
    debug('Unknown Option');
  }
  return extend(currentConfig, lbConfig);
}

function confirmSetupCaption(message) {
  return emoji.emojify(':warning: ') +
    chalk.yellow(' Installing loopback-ssl will update the existing files: \n' +
        '   - <app>/server/' +
        message.configFile +
        ', \n   - package.json \n   - <app>/server/server.js') +
      '\n  Do you want to continue with the above settings?';
}

function createDir(path) {
  try {
    fs.ensureDirSync(path);
    return true;
  } catch (e) {
    console.log(emoji.emojify(':no_entry: ') + chalk.red(' Could not create certificate directory ', path, ' ', e));
    return false;
  }
}

function genCerts(certPath, privateKey, cert, certDays, certCommonName) {
  if (createDir(certPath)) {
    pem.createCertificate({
      days: certDays,
      selfSigned: true,
      commonName: certCommonName
    }).then(keys => {
      fs.removeSync(certPath + '/');
      fs.outputFileSync(certPath + '/' + privateKey, keys.serviceKey);
      fs.outputFileSync(certPath + '/' + cert, keys.certificate);
    }).catch(error => {
      console.log(emoji.emojify(':no_entry: ') + chalk.red(' Could not create certificate directory ', error));
      process.exit(-1);
    });
  } else {
    process.exit(-1);
  }
}

module.exports.validateTargetPackage = validateTargetPackage;
module.exports.validateTargetConfigFile = validateTargetConfigFile;
module.exports.addLoopbackSSLDependency = addLoopbackSSLDependency;
module.exports.addLoopbackSSLConfig = addLoopbackSSLConfig;
module.exports.confirmSetupCaption = confirmSetupCaption;
module.exports.createDir = createDir;
module.exports.genCerts = genCerts;
