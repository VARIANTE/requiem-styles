/**
 * Requiem-Styles
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
 * Builds the CSS library.
 */
gulp.task('build:css', function() {
  return merge(
    // Compile Sass to CSS.
    gulp.src(config.tasks.build.css.pretty.input)
      .pipe($sourcemaps.init())
      .pipe($sass(config.tasks.build.css.pretty.sass))
      .pipe($postcss([autoprefixer(config.tasks.build.autoprefixer)]))
      .pipe($sourcemaps.write('./'))
      .pipe($size({
        title: '[build:css:pretty]',
        gzip: true
      }))
      .pipe(gulp.dest(config.tasks.build.css.pretty.output)),

    // Compile Sass to CSS (minified).
    gulp.src(config.tasks.build.css.ugly.input)
      .pipe($sass(config.tasks.build.css.ugly.sass))
      .pipe($postcss([autoprefixer(config.tasks.build.autoprefixer)]))
      .pipe($rename(config.tasks.build.css.ugly.outputFile))
      .pipe($size({
        title: '[build:css:ugly]',
        gzip: true
      }))
      .pipe(gulp.dest(config.tasks.build.css.ugly.output))
  );
});

/**
 * Builds the Sass library.
 */
gulp.task('build:sass', function() {
  return gulp.src(config.tasks.build.sass.input)
    .pipe($size({
      title: '[build:sass]',
      gzip: true
    }))
    .pipe(gulp.dest(config.tasks.build.sass.output));
});

/**
 * Builds the LESS library.
 */
gulp.task('build:less', function() {
  return gulp.src(config.tasks.build.less.input)
    .pipe($size({
      title: '[build:less]',
      gzip: true
    }))
    .pipe(gulp.dest(config.tasks.build.less.output));
});

/**
 * Builds the Stylus library.
 */
gulp.task('build:stylus', function() {
  return gulp.src(config.tasks.build.stylus.input)
    .pipe($size({
      title: '[build:stylus]',
      gzip: true
    }))
    .pipe(gulp.dest(config.tasks.build.stylus.output));
});

/**
 * Builds the entire stylesheet library. There are 4 different outputs:
 * 1. CSS library
 * 2. Sass library
 * 3. LESS library
 * 4. Stylus library
 */
gulp.task('build', function(done) {
  var seq = [['build:css', 'build:sass', 'build:less', 'build:stylus']];

  if (config.env.clean) {
    seq.unshift('clean');
  }

  seq.push(function() {
    if (config.env.watch) {
      for (var i = 0; i < config.tasks.watch.build.length; i++) {
        var entry = config.tasks.watch.build[i];
        gulp.watch(entry.files, entry.tasks);
      }
    }

    done();
  });

  sequence.apply(null, seq);
});
