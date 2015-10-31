import app from './app';
import prepare from './prepare';
import { logger } from './services';

const port = process.env.PORT || 3000;

function start() {
  return new Promise(resolve =>
    app.listen(port, () => {
      logger.info(`[app] server started, listening on ${port}.`);
      resolve();
    }));
}

// TODO serve an error dedicated app when error
prepare().then(() => start());
