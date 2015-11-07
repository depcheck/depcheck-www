import { logger } from '../services';

export function set({ session, provider, user }) {
  logger.debug(`[model:login] set login with provider [${provider}] and user [${user}].`);
  session.login = { provider, user };
  return Promise.resolve();
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
      reject({
        code: 401,
        message: 'Unanthorized, please login in.',
      });
    }
  });
}

export function isLoggedIn({ provider, user, session }) {
  return validate({ provider, user, session }).then(() => true, () => false);
}
