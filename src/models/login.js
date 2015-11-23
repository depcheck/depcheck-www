import response from './response';
import { logger } from '../services';
import { getProvider } from '../providers';

export function loginUser({ session, provider, code }) {
  logger.debug(`[model:login] login user with provider [${provider}] and code [${code}].`);
  const targetProvider = getProvider(provider);
  return targetProvider.getAccessToken(code)
    .then(accessToken => session.accessToken = accessToken)
    .then(accessToken => targetProvider.getUser(accessToken))
    .then(user => {
      session.login = { provider, user };
      return user;
    });
}

export function getUser({ login } = null) {
  logger.debug(`[model:login] get login user from session [${login}].`);
  return login;
}

export function validate({ provider, user, session: { login = {} } }) {
  logger.debug(`[model:login] validate [${provider}/${user}] request with session login ${JSON.stringify(login)}.`);
  return new Promise((resolve, reject) => {
    if (provider === login.provider && user === login.user) {
      logger.debug(`[model:login] validate [${provider}/${user}] request succeed.`);
      resolve();
    } else {
      logger.info(`[model:login] validate [${provider}/${user}] request fail.`);
      reject(response(401, 'Unanthorized, please login in.'));
    }
  });
}

export function isLoggedIn({ provider, user, session }) {
  return validate({ provider, user, session }).then(() => true, () => false);
}
