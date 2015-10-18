import getProvider from '../providers';
import * as tokenModel from './token';
import { logger } from '../services';

function mapTokenToRepo(tokens, repos) {
  const repoLookup = repos.reduce((result, repo) => ({
    ...result,
    [repo.name]: repo,
  }), {});

  const tokenLookup = tokens.reduce((result, token) => {
    if (result[token.repo]) {
      result[token.repo].token = token.token;
    } else {
      result[token.repo] = {
        name: token.repo,
        token: token.token,
        invalid: true,
      };
    }

    return result;
  }, repoLookup);

  return Object.keys(tokenLookup).map(key => tokenLookup[key]);
}

export function query({ provider, user }) {
  logger.debug(`[model:repo] query repo list with provider [${provider}] and user [${user}].`);

  const queryRepo = getProvider(provider).query(user);
  const queryToken = tokenModel.query({ provider, user });

  return Promise.all([queryRepo, queryToken])
  .then(([repos, tokens]) => mapTokenToRepo(tokens, repos));
}
