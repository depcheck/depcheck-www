import { logger } from '../../services';
import * as loginModel from '../../models/login';

export const route = '/login/:provider/callback';

export function redirect({ params: { provider }, query: { code }, session, urls }) {
  logger.debug(`[routes:login:callback] prepare user redirect URL from provider [${provider}] with code [${code}].`);
  return loginModel.loginUser({ session, provider, code })
    .then(user => urls.repo.index({ provider, user }));
}
