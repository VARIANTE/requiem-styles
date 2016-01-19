/**
 * Requiem-Styles
 * (c) VARIANTE (http://variante.io)
 *
 * Build tasks.
 *
 * This software is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */

import autoprefixer from 'autoprefixer';
import config from './.taskconfig';
import del from 'del';
import gulp from 'gulp';
import merge from 'merge-stream';
import sequence from 'run-sequence';
import $csso from 'gulp-csso';
import $less from 'gulp-less';
import $postcss from 'gulp-postcss';
import $rename from 'gulp-rename';
import $sass from 'gulp-sass';
import $size from 'gulp-size';
import $sourcemaps from 'gulp-sourcemaps';
import $stylus from 'gulp-stylus';

/**
 * Cleans the build directory.
 */
gulp.task('clean', (done) => {
  del(config.tasks.clean.input).then((paths) => done());
});

/**
 * Builds the CSS library.
 */
gulp.task('build:css', () => {
  return merge(
    // Compile Sass to CSS.
    gulp.src(config.tasks.build.css.pretty.input)
      .pipe($sourcemaps.init())
      .pipe($sass(config.tasks.build.css.pretty.sass))
      // .pipe($less(config.tasks.build.css.pretty.less))
      // .pipe($stylus(config.tasks.build.css.pretty.stylus))
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
      // .pipe($less(config.tasks.build.css.ugly.less))
      // .pipe($stylus(config.tasks.build.css.ugly.stylus))
      .pipe($postcss([autoprefixer(config.tasks.build.autoprefixer)]))
      .pipe($csso())
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
gulp.task('build:sass', () => {
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
gulp.task('build:less', () => {
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
gulp.task('build:stylus', () => {
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
gulp.task('build', (done) => {
  let seq = [['build:css', 'build:sass', 'build:less', 'build:stylus']];

  if (config.env.clean) {
    seq.unshift('clean');
  }

  seq.push(() => {
    if (config.env.watch) {
      for (let i = 0; i < config.tasks.watch.build.length; i++) {
        let entry = config.tasks.watch.build[i];
        gulp.watch(entry.files, entry.tasks);
      }
    }

    done();
  });

  sequence.apply(null, seq);
});
