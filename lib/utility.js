'use strict';

const debug = require('debug')('loopback-ssl:utility');
const chalk = require('chalk');

function validateTarget(pkg) {
  debug(pkg.name);
  debug(pkg.version);
  debug(pkg.dependencies);
  debug(pkg.dependencies.loopback);

  if (!(pkg.name && pkg.version && pkg.dependencies && pkg.dependencies.loopback)) {
    console.log(chalk.red('Error: Invalid package.json at destination. loopback-ssl cannot proceed'));
    process.exit(-1);
  }
}

module.exports.validateTarget = validateTarget;
