import fs from 'fs';
import del from 'del';
import path from 'path';
import gulp from 'gulp';
import mkdirp from 'mkdirp';

function writeFile(filePath, content) {
  const fileDir = path.dirname(filePath);
  return new Promise((resolve, reject) =>
    mkdirp(fileDir, error =>
      error ? reject(error) : fs.writeFile(filePath, content, resolve)));
}

gulp.task('azure:clean', () =>
  del([
    'App_Data',
    'server.js',
  ]));

gulp.task('azure:generate-server', ['azure:clean'], () => {
  const serverPath = path.resolve(__dirname, '../server.js');
  const content = 'require("./dist/index");';
  return writeFile(serverPath, content);
});

gulp.task('azure:generate-job', ['azure:clean'], () => {
  const nodePath = path.resolve(__dirname, '../node.cmd');
  const jobPath = path.resolve(__dirname, '../dist/job.js');
  const runPath = path.resolve(__dirname, '../App_Data/jobs/continuous/depcheck/run.cmd');
  const content = `"${nodePath}" "${jobPath}"`;
  return writeFile(runPath, content);
});

gulp.task('azure-tasks:configuration', ['configuration'], () =>
  writeFile(
    path.resolve(__dirname, '../dist/services/configuration.json'),
    JSON.stringify({ provider: 'azure' })));

gulp.task('build-azure', [
  'build',
  'azure:generate-server',
  'azure:generate-job',
  'azure:configuration',
]);
