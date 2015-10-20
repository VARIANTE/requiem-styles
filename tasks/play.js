/**
 * Requiem-Styles
 * (c) VARIANTE (http://variante.io)
 *
 * Playground tasks.
 *
 * This software is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */

var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync');
var config = require('./.taskconfig');
var del = require('del');
var gulp = require('gulp');
var merge = require('merge-stream');
var path = require('path');
var sequence = require('run-sequence');
var webpack = require('webpack');
var $jade = require('gulp-jade');
var $postcss = require('gulp-postcss');
var $sass = require('gulp-sass');
var $less = require('gulp-less');
var $size = require('gulp-size');
var $sourcemaps = require('gulp-sourcemaps');
var $stylus = require('gulp-stylus');
var $util = require('gulp-util');

/**
 * Cleans built files in the playground.
 */
gulp.task('clean:play', function(done) {
  del(config.tasks.play.clean.input).then(function(paths) {
    done();
  });
});

/**
 * Compiles CSS stylesheets for the playground.
 */
gulp.task('styles:css:play', function() {
  return gulp.src(config.tasks.play.styles.css.input)
    .pipe($postcss([autoprefixer()]))
    .pipe(gulp.dest(config.tasks.play.styles.css.output));
});

/**
 * Compiles Sass stylesheets for the playground.
 */
gulp.task('styles:sass:play', function() {
  return gulp.src(config.tasks.play.styles.sass.input)
    .pipe($sourcemaps.init())
    .pipe($sass(config.tasks.play.styles.sass.options)
    .on('error', function(err) {
      $util.log($util.colors.magenta('[sass] ') + $util.colors.red(err.message));
      this.emit('end');
    }))
    .pipe($postcss([autoprefixer()]))
    .pipe($sourcemaps.write())
    .pipe(gulp.dest(config.tasks.play.styles.sass.output));
});

/**
 * Compiles LESS stylesheets for the playground.
 */
gulp.task('styles:less:play', function() {
  return gulp.src(config.tasks.play.styles.less.input)
    .pipe($sourcemaps.init())
    .pipe($less(config.tasks.play.styles.less.options)
    .on('error', function(err) {
      $util.log($util.colors.magenta('[less] ') + $util.colors.red(err.message));
      this.emit('end');
    }))
    .pipe($postcss([autoprefixer()]))
    .pipe($sourcemaps.write())
    .pipe(gulp.dest(config.tasks.play.styles.less.output));
});

/**
 * Compiles Stylus stylesheets for the playground.
 */
gulp.task('styles:stylus:play', function() {
  return gulp.src(config.tasks.play.styles.stylus.input)
    .pipe($sourcemaps.init())
    .pipe($stylus(config.tasks.play.styles.stylus.options)
    .on('error', function(err) {
      $util.log($util.colors.magenta('[stylus] ') + $util.colors.red(err.message));
      this.emit('end');
    }))
    .pipe($postcss([autoprefixer()]))
    .pipe($sourcemaps.write())
    .pipe(gulp.dest(config.tasks.play.styles.stylus.output));
});

/**
 * Compiles JavaScripts for the playground, option to watch for
 * changes.
 *
 * @param {Boolean} --watch
 */
gulp.task('scripts:play', function(done) {
  var watchGuard = false;

  if (config.env.watch) {
    webpack(config.tasks.play.scripts.webpack).watch(100, build(done));
  }
  else {
    webpack(config.tasks.play.scripts.webpack).run(build(done));
  }

  function build(cb) {
    return function(err, stats) {
      if (err) {
        throw new $util.PluginError('webpack', err);
      }
      else {
        $util.log($util.colors.blue('[webpack]'), stats.toString());
      }

      if (!watchGuard && cb) {
        watchGuard = true;
        cb();
      }
    };
  }
});

/**
 * Compiles templates for the playground.
 */
gulp.task('templates:play', function() {
  return gulp.src(config.tasks.play.templates.input)
    .pipe($jade(config.tasks.play.templates.jade))
    .pipe(gulp.dest(config.tasks.play.templates.output));
});

/**
 * Serves the playground to the browser.
 *
 * @param {Number}  --port
 * @param {Boolean} --watch
 */
gulp.task('serve:play', function() {
  browserSync(config.tasks.play.serve.browserSync);

  // Watch for changes.
  if (config.env.watch) {
    var entries = config.tasks.watch.play;

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      gulp.watch(entry.files, entry.tasks);
    }
  }
});

/**
 * Builds the CSS library and playground, option to watch for
 * file changes and serve.
 *
 * @param {Number}  --port
 * @param {Boolean} --watch
 * @param {Boolean} --serve
 */
gulp.task('play:css', function(done) {
  config.env.clean = true;

  var seq = ['build', 'clean:play', ['styles:css:play', 'scripts:play', 'templates:play']];
  if (config.env.serve) seq.push('serve:play');
  seq.push(done);

  sequence.apply(null, seq);
});

/**
 * Builds the Sass library and playground, option to watch for
 * file changes and serve.
 *
 * @param {Number}  --port
 * @param {Boolean} --watch
 * @param {Boolean} --serve
 */
gulp.task('play:sass', function(done) {
  config.env.clean = true;

  var seq = ['build', 'clean:play', ['styles:sass:play', 'scripts:play', 'templates:play']];
  if (config.env.serve) seq.push('serve:play');
  seq.push(done);

  sequence.apply(null, seq);
});

/**
 * Builds the LESS library and playground, option to watch for
 * file changes and serve.
 *
 * @param {Number}  --port
 * @param {Boolean} --watch
 * @param {Boolean} --serve
 */
gulp.task('play:less', function(done) {
  config.env.clean = true;

  var seq = ['build', 'clean:play', ['styles:less:play', 'scripts:play', 'templates:play']];
  if (config.env.serve) seq.push('serve:play');
  seq.push(done);

  sequence.apply(null, seq);
});

/**
 * Builds the Stylus library and playground, option to watch for
 * file changes and serve.
 *
 * @param {Number}  --port
 * @param {Boolean} --watch
 * @param {Boolean} --serve
 */
gulp.task('play:stylus', function(done) {
  config.env.clean = true;

  var seq = ['build', 'clean:play', ['styles:stylus:play', 'scripts:play', 'templates:play']];
  if (config.env.serve) seq.push('serve:play');
  seq.push(done);

  sequence.apply(null, seq);
});
