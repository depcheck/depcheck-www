import request from 'request';
import { logger } from '../services';

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

export function getLoginUrl() {
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
  logger.debug(`[provider:github] generate login URL [${url}].`);
  return Promise.resolve(url);
}

function requestApi(url, options) {
  logger.debug(`[provider:github] request API [${url}] with options ${JSON.stringify(options)}.`);
  return new Promise((resolve, reject) =>
    request({
      ...options,
      url,
      json: true,
      headers: {
        'User-Agent': 'lijunle/depcheck-web',
      },
    }, (error, response, body) => {
      if (error) {
        logger.error(`[provider:github] request error. ${error.toString()}`);
        reject(error);
      } else if (response.statusCode !== 200) {
        logger.error(`[provider:github] request fail with status code [${response.statusCode}] and body ${JSON.stringify(body)}.`);
        reject(new Error(`Fail to request GitHub API, get response status code [${response.statusCode}].`));
      } else {
        resolve(body);
      }
    }));
}

export function getAccessToken(code) {
  return requestApi('https://github.com/login/oauth/access_token', {
    method: 'POST',
    qs: {
      code,
      client_id: clientId,
      client_secret: clientSecret,
    },
  })
  .then(({ access_token: accessToken }) => accessToken);
}

export function getUser(accessToken) {
  return requestApi('https://api.github.com/user', {
    qs: {
      access_token: accessToken,
    },
  })
  .then(({ login }) => login);
}

export function query(user) {
  return requestApi(`https://api.github.com/users/${user}/repos`)
  .then(repos => repos.map(({ name, description }) => ({ name, description })));
}
