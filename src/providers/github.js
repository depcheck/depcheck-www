import request from 'request';
import { logger } from '../services';

const clientId = process.env.GITHUB_CLIENT_ID;

export function getLoginUrl() {
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
  logger.debug(`[provider:github] generate login URL [${url}].`);
  return Promise.resolve(url);
}

export function query(user) {
  return new Promise((resolve, reject) => {
    const url = `https://api.github.com/users/${user}/repos`;

    logger.debug(`[provider:github] request API [${url}].`);
    request({
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
        logger.error(`[provider:github] request fail with status code [${response.statusCode}] and body [${body}].`);
        reject(new Error(`Fail to request GitHub API, get response status code [${response.statusCode}].`));
      } else {
        resolve(body.map(item => ({
          name: item.name,
          description: item.description,
        })));
      }
    });
  });
}
