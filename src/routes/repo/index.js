import { logger } from '../../services';
import * as repoModel from '../../models/repo';
import * as loginModel from '../../models/login';

export const route = '/:provider/:user';

export const view = 'repo-list';

export function model({ url, session, params: { provider, user } }) {
  logger.debug(`[routes:repo] prepare repo list for provider [${provider}], user [${user}].`);

  return loginModel.validate({ url, session })
  .then(() => repoModel.query({ provider, user }))
  .then(repos => ({
    provider,
    user,
    repos: repos.map(repo => ({
      ...repo,
      repoUrl: `/${provider}/${user}/${repo.name}`,
      requestTokenUrl: `/token/${provider}/${user}/${repo.name}`,
    })),
  }));
}
