import fs from 'fs';
import path from 'path';

function readFile(filePath) {
  return new Promise((resolve, reject) =>
    fs.readFile(filePath, 'utf-8', (error, content) =>
      error ? reject(error) : resolve(content)));
}

const tutorial = readFile(path.resolve(__dirname, '../../../doc/tutorial.md'))
  .then(content => content.split('\n').splice(2).join('\n')) // remove the title
  .catch(error => error.toString())
  .then(content => ({ content }));

export const route = '/tutorial';

export const view = 'tutorial';

export function model() {
  return tutorial;
}
