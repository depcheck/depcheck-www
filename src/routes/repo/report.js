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
  .then(() => Promise.all([
    reportModel.query({ provider, user, repo }),
    tokenModel.get({ provider, user, repo }).catch(() => undefined),
  ]))
  .then(([reports, token]) => ({
    provider,
    user,
    repo,
    token,
    tokenUrl: `/token/${provider}/${user}/${repo}`,
    reports: reports.map(report => ({
      ...report,
      caption: report.report
        ? `${report.branch}/${report.report}`
        : report.branch,
      badgeUrl: report.report
        ? `/${provider}/${user}/${repo}/${report.branch}/${report.report}.svg`
        : `/${provider}/${user}/${repo}/${report.branch}.svg`,
    })),
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
