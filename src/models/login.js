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

export function validateAccess({ session, provider, user, repo }) {
  logger.debug(`[model:login] validate access, pass through to function hasAccess.`);
  return hasAccess({ session, provider, user, repo })
    .then(result => {
      if (!result) {
        const login = session.login || {};
        throw response(401, `Unanthorized. User [${login.provider}/${login.user}] has no access to repo [${user}/${repo}].`);
      }
    });
}
