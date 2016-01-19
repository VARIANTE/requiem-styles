/**
 * Requiem-Styles
 * (c) VARIANTE (http://variante.io)
 *
 * Doc tasks.
 *
 * This software is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */

import config from './.taskconfig';
import del from 'del';
import gulp from 'gulp';
import path from 'path';
import { spawn } from 'child_process';

/**
 * Cleans generated doc files.
 */
gulp.task('clean:docs', (done) => {
  del(config.tasks.docs.clean.input).then((paths) => done());
});

/**
 * Generates the docs.
 */
gulp.task('docs', ['clean:docs'], (done) => {
  let proc = spawn(path.join(config.paths.modules, '.bin', 'sassdoc'), [
    config.tasks.docs.input,
    '-d',
    config.tasks.docs.output
  ], {
    stdio: 'inherit'
  });

  proc.on('exit', done);
});
