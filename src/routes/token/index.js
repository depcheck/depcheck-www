import { logger } from '../../services';
import * as loginModel from '../../models/login';
import * as tokenModel from '../../models/token';

export const route = '/token/:provider/:user/:repo';

export function post({ session, params: { provider, user, repo } }) {
  logger.debug(`[routes:token] post to create token for provider [${provider}], user [${user}] and repo [${repo}].`);
  return loginModel.validateAccess({ session, provider, user, repo })
    .then(() => tokenModel.create({ provider, user, repo }));
}
