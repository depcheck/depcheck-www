import uuid from 'uuid';
import express from 'express';
import config from './routes';
import layout from './layout';
import { logger } from '../services';
import { generateRoutes, generateUrls } from './generate';

function handleError(res) {
  return (error) => {
    const id = uuid.v1();
    if (error.isResponse) {
      // throw explicitly, message is safe to expose
      logger.warn(`Handle response error with log id [${id}]. ${JSON.stringify(error)}`);
      res.status(error.statusCode).send({
        id,
        message: error.message,
      });
    } else {
      // throw unexplicitly, log as error and not disclose error message
      logger.error(`Handle unexpected error with log id [${id}]. Message: [${error.message}]. Call stack: [${error.stack}]`);
      res.status(500).send({
        id,
        message: 'Unexpected error happens.',
      });
    }
  };
}

function register(router, route, name, method) {
  return (middlewares = [], fn) => {
    router[method](route, ...middlewares, (req, res) => {
      logger.debug(`[routes] request [${method}] URL [${req.url}], hit route [${route}] from file [${name}].`);
      fn(req, res).catch(handleError(res));
    });
  };
}

function createRouter() {
  const router = new express.Router();
  const routes = config.generate ? generateRoutes() : config.routes;
  const modules = routes.map(name => ({ name, module: require(`./${name}`) }));
  const urls = generateUrls(modules);

  modules.forEach(({ name, module }) => {
    const get = register(router, module.route, name, 'get');
    const post = register(router, module.route, name, 'post');

    logger.debug(`[routes] route [${module.route}] from file [${name}] provides functions [${Object.keys(module)}].`);

    if (module.post) {
      post(module.post.middlewares, (req, res) =>
        module.post({ ...req, urls }).then(result =>
          res.format({
            json: () => res.send(result),
            html: () => res.redirect(req.get('Referer')),
          })));
    }

    if (module.redirect) {
      get(module.redirect.middlewares, (req, res) =>
        module.redirect({ ...req, urls }).then(url => res.redirect(url)));
    } else if (module.view && module.model) {
      const type = module.type || 'html';
      get(module.model.middlewares, (req, res) =>
        module.model({ ...req, urls })
        .then(model => ({ ...layout({ ...req, urls }), ...model }))
        .then(model => res.type(type).render(module.view, model)));
    }
  });

  return router;
}

export default createRouter();
