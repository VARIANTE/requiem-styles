/**
 * Requiem-Styles
 * (c) VARIANTE (http://variante.io)
 *
 * Playground tasks.
 *
 * This software is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */

import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import config from './.taskconfig';
import del from 'del';
import gulp from 'gulp';
import merge from 'merge-stream';
import path from 'path';
import sequence from 'run-sequence';
import webpack from 'webpack';
import $jade from 'gulp-jade';
import $postcss from 'gulp-postcss';
import $sass from 'gulp-sass';
import $less from 'gulp-less';
import $size from 'gulp-size';
import $sourcemaps from 'gulp-sourcemaps';
import $stylus from 'gulp-stylus';
import $util from 'gulp-util';

/**
 * Cleans built files in the playground.
 */
gulp.task('clean:play', (done) => {
  del(config.tasks.play.clean.input).then((paths) => done());
});

/**
 * Compiles CSS stylesheets for the playground.
 */
gulp.task('styles:css:play', () => {
  return merge(
    gulp.src(path.join(config.tasks.build.css.ugly.output, config.tasks.build.css.ugly.outputFile))
      .pipe(gulp.dest(config.tasks.play.styles.css.output)),
    gulp.src(config.tasks.play.styles.css.input)
      .pipe($postcss([autoprefixer()]))
      .pipe(gulp.dest(config.tasks.play.styles.css.output))
  );
});

/**
 * Compiles Sass stylesheets for the playground.
 */
gulp.task('styles:sass:play', () => {
  return gulp.src(config.tasks.play.styles.sass.input)
    .pipe($sourcemaps.init())
    .pipe($sass(config.tasks.play.styles.sass.options)
    .on('error', (err) => {
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
gulp.task('styles:less:play', () => {
  return gulp.src(config.tasks.play.styles.less.input)
    .pipe($sourcemaps.init())
    .pipe($less(config.tasks.play.styles.less.options)
    .on('error', (err) => {
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
gulp.task('styles:stylus:play', () => {
  return gulp.src(config.tasks.play.styles.stylus.input)
    .pipe($sourcemaps.init())
    .pipe($stylus(config.tasks.play.styles.stylus.options)
    .on('error', (err) => {
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
 * @param {boolean} --watch
 */
gulp.task('scripts:play', (done) => {
  var watchGuard = false;

  if (config.env.watch)
    webpack(config.tasks.play.scripts.webpack).watch(100, build(done));
  else
    webpack(config.tasks.play.scripts.webpack).run(build(done));

  function build(cb) {
    return (err, stats) => {
      if (err)
        throw new $util.PluginError('webpack', err);
      else
        $util.log($util.colors.blue('[webpack]'), stats.toString());

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
gulp.task('templates:play', () => {
  return gulp.src(config.tasks.play.templates.input)
    .pipe($jade(config.tasks.play.templates.jade))
    .pipe(gulp.dest(config.tasks.play.templates.output));
});

/**
 * Serves the playground to the browser.
 *
 * @param {number}  --port
 * @param {boolean} --watch
 */
gulp.task('serve:play', () => {
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
 * @param {number}  --port
 * @param {boolean} --watch
 * @param {boolean} --serve
 */
gulp.task('play:css', (done) => {
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
 * @param {number}  --port
 * @param {boolean} --watch
 * @param {boolean} --serve
 */
gulp.task('play:sass', (done) => {
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
 * @param {number}  --port
 * @param {boolean} --watch
 * @param {boolean} --serve
 */
gulp.task('play:less', (done) => {
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
 * @param {number}  --port
 * @param {boolean} --watch
 * @param {boolean} --serve
 */
gulp.task('play:stylus', (done) => {
  config.env.clean = true;

  var seq = ['build', 'clean:play', ['styles:stylus:play', 'scripts:play', 'templates:play']];
  if (config.env.serve) seq.push('serve:play');
  seq.push(done);

  sequence.apply(null, seq);
});
