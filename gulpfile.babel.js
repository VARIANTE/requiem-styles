/**
 * Requiem-Styles
 * (c) VARIANTE (http://variante.io)
 *
 * Gulp tasks.
 *
 * This software is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 */


import config from './tasks/.taskconfig';
import gulp from 'gulp';
import sequence from 'run-sequence';
import './tasks/build';
import './tasks/play';
import './tasks/docs';

/**
 * Default task.
 *
 * @param {boolean} --watch
 */
gulp.task('default', () => {
  sequence.apply(null, ['clean', 'build']);
});
