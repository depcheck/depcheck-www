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

function validate2({ url, session: { login } }) {
  logger.debug(`[model:login] validate request [${url}] with session login ${JSON.stringify(login)}.`);
  return new Promise((resolve, reject) => {
    if (url.indexOf(login) === 0 || url.indexOf(`/token${login}`) === 0) {
      logger.debug(`[model:login] validate request [${url}] succeed, move to next middleware.`);
      resolve();
    } else {
      logger.info(`[model:login] validate request [${url}] fail.`);
      reject({
        code: 401,
        message: 'Unanthorized, please login in.',
      });
    }
  });
}

export function validate(req, res, next) {
  if (!next) {
    // TODO replace validate with validate2 after all converted to routes pattern.
    return validate2(req);
  }

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
