import { logger } from '../services';

export function set({ session, provider, user }) {
  logger.debug(`[model:login] set login with provider [${provider}] and user [${user}].`);
  session.login = `/${provider}/${user}`; // TODO store login object
  return Promise.resolve();
}

export function getUser({ login } = {}) {
  logger.debug(`[model:login] get login user from session [${login}].`);

  if (!login) {
    return null;
  }

  // TODO change to store meaningful object to session
  const [provider, user] = login.substring(1).split('/');
  return { provider, user };
}

export function validate(req, res, next) {
  const url = req.url;
  const login = req.session.login;
  logger.debug(`[model:login] validate request [${url}] with session login ${JSON.stringify(login)}.`);
  if (url.indexOf(login) === 0 || url.indexOf(`/token${login}`) === 0) {
    logger.debug(`[model:login] validate request [${url}] succeed, move to next middleware.`);
    next();
  } else {
    logger.info(`[model:login] validate request [${url}] fail.`);
    res.status(401).end('Unanthorized, please login in.');
  }
}
