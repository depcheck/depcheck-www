import fs from 'fs';
import del from 'del';
import path from 'path';
import gulp from 'gulp';
import mkdirp from 'mkdirp';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';

import './build/azure';

function writeFile(filePath, content) {
  const fileDir = path.dirname(filePath);
  return new Promise((resolve, reject) =>
    mkdirp(fileDir, error =>
      error ? reject(error) : fs.writeFile(filePath, content, resolve)));
}

gulp.task('clean', ['azure:clean'], () =>
  del(['dist']));

gulp.task('lint', () =>
  gulp.src(['gulpfile.js', 'src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError()));

gulp.task('transform', ['clean'], () =>
  gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist')));

gulp.task('configuration', ['clean'], () =>
  writeFile(
    path.resolve(__dirname, './dist/services/configuration.json'),
    '{}'));

gulp.task('build', ['lint', 'transform', 'configuration']);
