import path from 'path';
import express from 'express';
import session from 'express-session';
import react from 'express-react-views';
import fileStoreFactory from 'session-file-store';
import prepare from './prepare';
import controller from './controllers';
import { logger } from './services';

const port = process.env.PORT || 3000;
const sessionSecret = process.env.SESSION_SECRET || 'SESSION_SECRET';
const FileStore = fileStoreFactory(session);
const viewEngine = react.createEngine({ transformViews: false });
const app = express();

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'js');

app.engine('js', (filePath, options, callback) => {
  logger.debug(`[app] render view file [${filePath}].`);
  return viewEngine(filePath, options, (error, html) => {
    // HACK to support serve SVG, see reactjs/express-react-views#53
    const raw = html.substring('<!DOCTYPE html>'.length);
    const hack = raw.indexOf('<svg') === 0
      ? raw.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
      : html;

    callback(error, hack);
  });
});

app.use((req, res, next) => {
  logger.debug(`[app] request [${req.method}] route [${req.url}].`);
  next();
});

app.use(session({
  store: new FileStore(),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
}));

app.use('/', controller);

// TODO serve an error dedicated app when error
prepare().then(() =>
  app.listen(port, () =>
    logger.info(`[app] server started, listening on ${port}.`)));
