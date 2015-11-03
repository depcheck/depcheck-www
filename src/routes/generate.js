import file from 'file';

export default function generateRoutes() {
  let routes = [];
  const startIndex = __dirname.length + 1;

  file.walkSync(__dirname, (dirPath, dirs, files) => {
    routes = routes.concat(
      dirPath !== __dirname
      ? files.map(name => `${dirPath}/${name}`.substring(startIndex))
      : []);
  });

  return routes;
}
