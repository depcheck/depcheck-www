import * as loginModel from '../../models/login';
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
