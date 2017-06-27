'use strict';

var gulp = require('gulp');
var shrinkwrap = require('gulp-shrinkwrap');
var gulpNSP = require('gulp-nsp');
var path = require('path');

gulp.task('nsp', function (cb) {
  return gulpNSP({
    shrinkwrap: path.join(__dirname, '/npm-shrinkwrap.json'),
    package: path.join(__dirname, '/package.json'),
    output: 'default',
    stopOnError: false
  }, cb);
});

gulp.task('shrinkwrap', function () {
  return gulp.src('./package.json')
    .pipe(shrinkwrap.lock())
    .pipe(gulp.dest('./'));
});

gulp.task('default', [
  'shrinkwrap',
  'nsp'
], function () {});

gulp.task('build', ['default']);
