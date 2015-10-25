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
  const { route } = module;

  // TODO need refactor for easier maintain
  if (module.post) {
    router.post(route, (req, res) => {
      logger.debug(`[routes:index] post [${route}] from file [${name}].`);
      module.post(req).then(result =>
        req.xhr ? res.send(result) : res.redirect(req.get('Referer')));
    });
  } else {
    router.get(route, (req, res) => {
      logger.debug(`[routes:index] route [${route}] from file [${name}] is hit.`);

      if (module.redirect) {
        logger.debug(`[routes:index] route [${route}] provides redirect function.`);
        module.redirect(req).then(url => res.redirect(url));
      } else if (module.view && module.model) {
        logger.debug(`[routes:index] route [${route}] provides render view function.`);
        res.render(module.view, module.model(req));
      } else {
        logger.error(`[routes:index] route [${route}] does not provide any function.`);
        res.status(500).end();
      }
    });
  }
});
