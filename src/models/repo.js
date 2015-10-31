import * as tokenModel from './token';
import { logger } from '../services';
import { getProvider } from '../providers';

function toModel(repos, tokens) {
  const repoMap = new Map(repos.map(repo => [repo.name, repo]));
  const invalid = [];

  for (const token of tokens) {
    const repo = repoMap.get(token.repo);
    if (repo) {
      repo.token = token.token;
    } else {
      invalid.push({
        name: token.repo,
        invalid: true,
      });
    }
  }

  return repos.concat(invalid);
}

export function query({ provider, user }) {
  logger.debug(`[model:repo] query repo list with provider [${provider}] and user [${user}].`);

  const queryRepo = getProvider(provider).query(user);
  const queryToken = tokenModel.query({ provider, user });

  return Promise.all([queryRepo, queryToken])
  .then(([repos, tokens]) => toModel(repos, tokens));
}
