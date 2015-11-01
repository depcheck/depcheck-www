import { compile } from 'path-to-regexp';
import { logger } from '../../services';
import { url as reportUrl } from './report';
import { url as badgeUrl } from '../report/svg';
import * as repoModel from '../../models/repo';
import * as loginModel from '../../models/login';

export const route = '/:provider/:user';

export const url = compile(route);

export const view = 'repo-list';

function filterEnabled(provider, user, repos) {
  return repos.filter(repo => repo.token && !repo.invalid).map(repo => ({
    ...repo,
    token: undefined, // hide token from this view model
    enabled: true,
    repoUrl: reportUrl({
      provider,
      user,
      repo: repo.name,
    }),
    badgeUrl: badgeUrl({
      provider,
      user,
      repo: repo.name,
      branch: 'master', // TODO query master branch from provider
    }),
  }));
}

function filterDisabled(provider, user, repos) {
  return repos.filter(repo => !repo.token && !repo.invalid).map(repo => ({
    ...repo,
    repoUrl: reportUrl({
      provider,
      user,
      repo: repo.name,
    }),
  }));
}

function filterInvalid(provider, user, repos) {
  return repos.filter(repo => repo.invalid).map(repo => ({
    ...repo,
    repoUrl: reportUrl({
      provider,
      user,
      repo: repo.name,
    }),
  }));
}

export function model({ session, params: { provider, user } }) {
  logger.debug(`[routes:repo] prepare repo list for provider [${provider}], user [${user}].`);

  return loginModel.validate({ provider, user, session })
  .then(() => repoModel.query({ provider, user }))
  .then(repos => ({
    provider,
    user,
    enabled: filterEnabled(provider, user, repos),
    disabled: filterDisabled(provider, user, repos),
    invalid: filterInvalid(provider, user, repos),
  }));
}
