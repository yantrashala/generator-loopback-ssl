# generator-loopback-ssl

Configuration generator for node module loopback-ssl (https://www.npmjs.com/package/loopback-ssl)

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]


## Installation

First, install [Yeoman](http://yeoman.io) and generator-loopback-ssl using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-loopback-ssl
```

Install loopback

```bash

# install loopback-cli
npm install -g loopback-cli

# create project directory
mkdir <app-name>
cd <app-name>

# create loopback application
lb
# ? What's the name of your application? <app-name>
# ? Which version of LoopBack would you like to use? 3.x (current)
# ? What kind of application do you have in mind? notes
```

Install loopback-ssl

```bash
yo loopback-ssl
```

## Getting To loopback-ssl

 * Node module to enable HTTPS/SSL in a loopback application with simple configurations.
 * The module also enables trusted peer authentication.
 * Feel free to [learn more about loopback-ssl](https://github.com/yantrashala/loopback-ssl/blob/master/README.md).

# Contributing

 - Want to contribute? Great! Please check this [guide](https://github.com/yantrashala/generator-loopback-ssl/blob/master/CONTRIBUTING.md).
 - Fork it ( https://github.com/yantrashala/generator-loopback-ssl/fork )
 - Create your feature branch (git checkout -b new-feature)
 - Commit your changes (git commit -am 'Add some feature')
 - Push to the branch (git push origin new-feature)
 - Create new Pull Request

# See Also

 - [Self Signed Certificates - Example][self_signed]

# License

  [MIT](./LICENSE).

 [loopback]: http://loopback.io
 [loopback-ssl]: https://www.npmjs.com/package/loopback-ssl
 [trusted_peer]: https://github.com/coolaj86/nodejs-ssl-trusted-peer-example
 [self_signed]: https://github.com/coolaj86/nodejs-self-signed-certificate-example


[npm-image]: https://badge.fury.io/js/generator-loopback-ssl.svg
[npm-url]: https://npmjs.org/package/generator-loopback-ssl
[travis-image]: https://travis-ci.org/yantrashala/generator-loopback-ssl.svg?branch=master
[travis-url]: https://travis-ci.org/yantrashala/generator-loopback-ssl
[daviddm-image]: https://david-dm.org/yantrashala/generator-loopback-ssl.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/yantrashala/generator-loopback-ssl
[coveralls-image]: https://coveralls.io/repos/yantrashala/generator-loopback-ssl/badge.svg
[coveralls-url]: https://coveralls.io/r/yantrashala/generator-loopback-ssl
