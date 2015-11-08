import { generateRoutes, generateUrls } from '../../src/routes/generate';

function requireRoute(name) {
  return require(`../../src/routes/${name}`);
}

function constructUrls() {
  const routes = generateRoutes();
  const modules = routes.map(name => ({ name, module: requireRoute(name) }));
  const urls = generateUrls(modules);
  return urls;
}

export default constructUrls();
