import bodyParser from 'body-parser';
import * as loginModel from '../../models/login';
import * as tokenModel from '../../models/token';
import * as reportModel from '../../models/report';

export const route = '/:provider/:user/:repo';

export const view = 'repo';

export function model({
    urls,
    session,
    params: { provider, user, repo },
  }) {
  return Promise.all([
    loginModel.hasAccess({ session, provider, user, repo }),
    reportModel.query({ provider, user, repo }),
    tokenModel.get({ provider, user, repo }).catch(() => undefined),
  ])
  .then(([hasAccess, reports, token]) => ({
    provider,
    user,
    repo,
    hasAccess,
    token: hasAccess ? token : null,
    tokenUrl: hasAccess && !token ? urls.token.index({
      provider,
      user,
      repo,
    }) : null,
    reports: reports.map(report => ({
      ...report,
      caption: report.report
        ? `${report.branch}/${report.report}`
        : report.branch,
      badgeUrl: urls.report.svg({
        provider,
        user,
        repo,
        branch: report.branch,
        report: report.report || undefined,
      }),
    })),
  }));
}

function endsWith(subject, search) {
  const position = subject.length - search.length;
  const lastIndex = subject.indexOf(search, position);
  return lastIndex !== -1 && lastIndex === position;
}

model.middlewares = [
  (req, res, next) => next(endsWith(req.url, '.svg') ? 'route' : undefined),
];

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
