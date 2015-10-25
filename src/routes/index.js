import express from 'express';
import { logger } from '../services';

const router = new express.Router();
export default router;

const routes = [
  'home',
  'login',
  'login/callback',
  'token',
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
    route.post((req, res) =>
      module.post(req).then(result =>
        req.xhr ? res.send(result) : res.redirect(req.get('Referer'))));
  } else if (module.redirect) {
    route.get((req, res) =>
      module.redirect(req).then(url => res.redirect(url)));
  } else if (module.view && module.model) {
    route.get((req, res) =>
      module.model(req).then(model => res.render(module.view, model)));
  } else {
    route.get((req, res) =>
      res.status(500).end());
  }
});
