import del from 'del';
import path from 'path';
import gulp from 'gulp';
import writeFile from './write-file';

gulp.task('azure:clean', () =>
  del('server.js'));

gulp.task('azure:generate-server', ['azure:clean'], () => {
  const serverPath = path.resolve(__dirname, '../server.js');
  const content = 'require("./dist/index");';
  return writeFile(serverPath, content);
});

gulp.task('azure:services', ['services'], () =>
  writeFile(
    path.resolve(__dirname, '../dist/services/configuration.json'),
    JSON.stringify({ provider: 'azure' })));

gulp.task('build-azure', [
  'build',
  'azure:generate-server',
  'azure:services',
]);
