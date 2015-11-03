import del from 'del';
import path from 'path';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import writeFile from './build/write-file';
import generateRoutes from './src/routes/generate';

import './build/azure';

gulp.task('clean', ['azure:clean'], () =>
  del(['dist']));

gulp.task('lint', () =>
  gulp.src(['gulpfile.js', 'src/**/*.js', 'test/**/*.js'])
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

gulp.task('routes', ['clean'], () =>
  writeFile(
    path.resolve(__dirname, './dist/routes/routes.json'),
    JSON.stringify({ routes: generateRoutes() })));

gulp.task('build', [
  'lint',
  'routes',
  'transform',
  'configuration',
]);
