import prepare from './prepare';
import services from './services';
import createApp from './app';

const app = createApp(services);
const port = process.env.PORT || 3000;

// TODO serve an error dedicated app when error
prepare().then(() =>
  app.listen(port, () =>
    services.logger.info(`[app] server started, listening on ${port}.`)));
