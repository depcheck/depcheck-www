import express from 'express';
import generateRoutes from './generate';
import { logger } from '../services';

function handleError(res) {
  return (error) => {
    // TODO implement more safe error handling
    logger.warn(error);
    res.status(error.code).send(error.message);
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
  const routes = generateRoutes();

  routes.forEach(name => {
    const module = require(`./${name}`);
    const get = register(router, module.route, name, 'get');
    const post = register(router, module.route, name, 'post');

    logger.debug(`[routes] route [${module.route}] from file [${name}] provides functions [${Object.keys(module)}].`);

    if (module.post) {
      post(module.post.middlewares, (req, res) =>
        module.post(req).then(result =>
          // TODO leverage `res.format` to better content-negotiation
          req.accepts('html') === 'html'
          ? res.redirect(req.get('Referer'))
          : res.send(result)));
    }

    if (module.redirect) {
      get(module.redirect.middlewares, (req, res) =>
        module.redirect(req).then(url => res.redirect(url)));
    } else if (module.view && module.model) {
      get(module.model.middlewares, (req, res) =>
        module.model(req).then(model =>
          res.type(module.type || 'html').render(module.view, model)));
    }
  });

  return router;
}

export default createRouter();
