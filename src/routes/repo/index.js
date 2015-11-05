import { compile } from 'path-to-regexp';
import { logger } from '../../services';
import * as repoModel from '../../models/repo';
import * as loginModel from '../../models/login';

export const route = '/:provider/:user';

export const url = compile(route);

export const view = 'repo-list';

function filterEnabled(provider, user, repos, urls) {
  return repos.filter(repo => repo.token && !repo.invalid).map(repo => ({
    ...repo,
    token: undefined, // hide token from this view model
    enabled: true,
    repoUrl: urls.repo.report({
      provider,
      user,
      repo: repo.name,
    }),
    badgeUrl: urls.report.svg({
      provider,
      user,
      repo: repo.name,
      branch: 'master', // TODO query master branch from provider
    }),
  }));
}

function filterDisabled(provider, user, repos, urls) {
  return repos.filter(repo => !repo.token && !repo.invalid).map(repo => ({
    ...repo,
    repoUrl: urls.repo.report({
      provider,
      user,
      repo: repo.name,
    }),
  }));
}

function filterInvalid(provider, user, repos, urls) {
  return repos.filter(repo => repo.invalid).map(repo => ({
    ...repo,
    repoUrl: urls.repo.report({
      provider,
      user,
      repo: repo.name,
    }),
  }));
}

export function model({ urls, session, params: { provider, user } }) {
  logger.debug(`[routes:repo] prepare repo list for provider [${provider}], user [${user}].`);

  return loginModel.validate({ provider, user, session })
  .then(() => repoModel.query({ provider, user }))
  .then(repos => ({
    provider,
    user,
    enabled: filterEnabled(provider, user, repos, urls),
    disabled: filterDisabled(provider, user, repos, urls),
    invalid: filterInvalid(provider, user, repos, urls),
  }));
}
