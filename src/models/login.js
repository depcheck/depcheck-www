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

export function hasAccess({ session, provider, user, repo }) {
  const login = session.login || {};
  const loggedInUser = `${login.provider}/${login.user}`;
  const accessToken = session.accessToken || '';
  const repoFullName = `${user}/${repo}`;
  logger.debug(`[model:login] check if login user [${loggedInUser}] with access token [${accessToken}] has access to [${repoFullName}].`);

  const targetProvider = getProvider(provider);
  return targetProvider.getRepos(accessToken) // TODO cache repos to storage
    .then(repos => {
      const result = repos.indexOf(repoFullName) !== -1;
      logger.debug(`[model:login] login user [${loggedInUser}] ${result ? 'has' : 'has no'} access to [${repoFullName}].`);
      return result;
    });
}
