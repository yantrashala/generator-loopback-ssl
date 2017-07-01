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

module.exports = class extends Generator {
  prompting() {
    this.log(yosay(
      'Welcome to '
        + chalk.yellow(this.rootGeneratorName())
        +' Version: '
        + chalk.red(this.rootGeneratorVersion())
    ));

  };
};
