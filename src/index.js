import express from 'express';
import prepare from './prepare';
import controller from './controllers';
import { logger } from './services';

const port = process.env.PORT || 3000;
const app = express();

app.use((req, res, next) => {
  logger.debug(`[app] request [${req.method}] route [${req.url}].`);
  next();
});

app.use('/', controller);

// TODO serve an error dedicated app when error
prepare().then(() =>
  app.listen(port, () =>
    logger.info(`[app] server started, listening on ${port}.`)));
