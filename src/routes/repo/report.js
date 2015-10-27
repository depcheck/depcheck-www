import bodyParser from 'body-parser';
import * as loginModel from '../../models/login';
import * as tokenModel from '../../models/token';
import * as reportModel from '../../models/report';

export const route = '/:provider/:user/:repo';

export const view = 'repo';

export function model({
    url,
    session,
    params: { provider, user, repo },
  }) {
  return loginModel.validate({ url, session })
  .then(() => reportModel.query({ provider, user, repo }))
  .then(reports => ({
    provider,
    user,
    repo,
    reports,
  }));
}

export function post({
    params: { provider, user, repo },
    body: { token, branch, report, result },
  }) {
  return tokenModel.validate({
    provider,
    user,
    repo,
    token,
  })
  .then(() => reportModel.upsert({
    provider,
    user,
    repo,
    branch,
    report,
    result,
  }));
}

post.middlewares = [bodyParser.json()];
