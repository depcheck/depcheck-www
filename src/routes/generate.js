import file from 'file';
import { set } from 'lodash';
import { compile } from 'path-to-regexp';

const startIndex = __dirname.length + 1;

function toRoute(dirPath, name) {
  const prefix = dirPath.substring(startIndex);
  const basename = name.slice(0, -3); // strip .js extension
  return `${prefix}/${basename}`;
}

export function generateRoutes() {
  let routes = [];

  file.walkSync(__dirname, (dirPath, dirs, files) =>
    routes = routes.concat(
      dirPath !== __dirname
      ? files.map(name => toRoute(dirPath, name))
      : []));

  return routes;
}

export function generateUrls(modules) {
  return modules.reduce((object, { name, module }) => {
    const path = name.replace('/', '.'); // convert name to object path
    const route = compile(module.route);
    return set(object, path, route);
  }, {});
}
