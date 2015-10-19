/**
 * Requiem
 * (c) VARIANTE (http://variante.io)
 *
 * Build tasks.
 *
 * This software is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */

var autoprefixer = require('autoprefixer');
var config = require('./.taskconfig');
var del = require('del');
var gulp = require('gulp');
var merge = require('merge-stream');
var sequence = require('run-sequence');
var $csso = require('gulp-csso');
var $postcss = require('gulp-postcss');
var $rename = require('gulp-rename');
var $sass = require('gulp-sass');
var $size = require('gulp-size');
var $sourcemaps = require('gulp-sourcemaps');

/**
 * Cleans the build directory.
 */
gulp.task('clean', function(done) {
  del(config.tasks.clean.input).then(function(paths) {
    done();
  });
});

/**
 * Wires dependencies into the Sass library.
 */
gulp.task('wiredeps', function() {
  return gulp.src(config.tasks.wiredeps.normalize.input)
    .pipe($rename(config.tasks.wiredeps.normalize.outputFile))
    .pipe(gulp.dest(config.tasks.wiredeps.normalize.output));
});

/**
 * Builds the stylesheet library. There are 3 different outputs:
 * 1. CSS library, uncompressed
 * 2. CSS library, compressed
 * 3. Sass library
 */
gulp.task('build', ['wiredeps'], function() {
  return merge(
    // Compile Sass to CSS.
    gulp.src(config.tasks.build.css.input)
      .pipe($sourcemaps.init())
      .pipe($sass(config.tasks.build.css.sass))
      .pipe($postcss([autoprefixer(config.tasks.build.autoprefixer)]))
      .pipe($sourcemaps.write('./'))
      .pipe($size({
        title: '[build:css:pretty]',
        gzip: true
      }))
      .pipe(gulp.dest(config.tasks.build.css.output)),

    // Compile Sass to CSS (minified).
    gulp.src(config.tasks.build.css.input)
      .pipe($sass(config.tasks.build.css.sass))
      .pipe($postcss([autoprefixer(config.tasks.build.autoprefixer)]))
      .pipe($csso())
      .pipe($rename(config.tasks.build.css.outputFile))
      .pipe($size({
        title: '[build:css:ugly]',
        gzip: true
      }))
      .pipe(gulp.dest(config.tasks.build.css.output)),

    // Copy Sass to dist directory.
    gulp.src(config.tasks.build.sass.input)
      .pipe($size({
        title: '[build:sass]',
        gzip: true
      }))
      .pipe(gulp.dest(config.tasks.build.sass.output))
  );
});
