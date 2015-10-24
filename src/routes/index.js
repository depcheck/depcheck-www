import express from 'express';
import { logger } from '../services';

const router = new express.Router();
export default router;

const routes = [
  'home',
];

routes.forEach(name => {
  const { route, view, model } = require(`./${name}`);
  router.get(route, (req, res) => {
    logger.debug(`[routes:index] route [${route}] from file [${name}] is hit.`);
    res.render(view, model(req));
  });
});
