'use strict';

const debug = require('debug')('loopback-ssl:utility');
const chalk = require('chalk');
const emoji = require('node-emoji');

function validateTarget(pkg) {
  debug('Target package name:', pkg.name);
  debug('Target package version:', pkg.version);
  if (pkg.dependencies) {
    debug('Target package Loopback version:', pkg.dependencies.loopback);
  }
  if (!(pkg.name && pkg.version && pkg.dependencies && pkg.dependencies.loopback)) {
    console.log(emoji.emojify(':no_entry: ') + chalk.red(' Invalid package.json at destination. loopback-ssl cannot proceed'));
    process.exit(-1);
  }
}

module.exports.validateTarget = validateTarget;
