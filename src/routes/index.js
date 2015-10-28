import express from 'express';
import { logger } from '../services';

const router = new express.Router();
export default router;

function handleError(res) {
  return (error) => {
    // TODO implement more safe error handling
    logger.warn(error);
    res.status(error.code).send(error.message);
  };
}

const routes = [
  'home',
  'login',
  'login/callback',
  'token',
  'report/svg', // report/svg must place before repo/report.
  'repo',
  'repo/report',
];

routes.forEach(name => {
  const module = require(`./${name}`);
  const route = router.route(module.route);

  logger.debug(`[routes] route [${module.route}] from file [${name}] provides functions [${Object.keys(module)}].`);
  route.all((req, res, next) => {
    logger.debug(`[routes] request [${req.method}] path [${req.url}], hit route [${module.route}] from file [${name}].`);
    next();
  });

  if (module.post) {
    const middlewares = module.post.middlewares || [];
    route.post(
      ...middlewares,
      (req, res) =>
        module.post(req)
          .then(result =>
            // TODO leverage `res.format` to better content-negotiation
            req.accepts('html') === 'html'
            ? res.redirect(req.get('Referer'))
            : res.send(result))
          .catch(handleError(res)));
  }

  if (module.redirect) {
    route.get((req, res) =>
      module.redirect(req)
        .then(url => res.redirect(url)
        .catch(handleError(res))));
  } else if (module.view && module.model) {
    route.get((req, res) =>
      module.model(req)
        .then(model =>
          res.type(module.type || 'html').render(module.view, model))
        .catch(handleError(res)));
  } else {
    route.get((req, res) =>
      res.status(500).end());
  }
});
