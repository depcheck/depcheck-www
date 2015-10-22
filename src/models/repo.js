import getProvider from '../providers';
import * as tokenModel from './token';

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

export function query({ logger, table }, { provider, user }) {
  logger.debug(`[model:repo] query repo list with provider [${provider}] and user [${user}].`);

  const queryRepo = getProvider(provider).query(user);
  const queryToken = tokenModel.query({ logger, table }, { provider, user });

  return Promise.all([queryRepo, queryToken])
  .then(([repos, tokens]) => ({
    provider,
    user,
    repos: mapTokenToRepo(tokens, repos).map(repo => ({
      ...repo,
      repoUrl: `/${provider}/${user}/${repo.name}`,
      requestTokenUrl: `/token/${provider}/${user}/${repo.name}`,
    })),
  }));
}
