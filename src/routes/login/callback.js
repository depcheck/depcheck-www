import { logger } from '../../services';
import { getProvider } from '../../providers';
import * as loginModel from '../../models/login';

export const route = '/login/:provider/callback';

export function redirect({ params: { provider }, query: { code }, session }) {
  logger.debug(`[routes:login:callback] prepare user redirect URL from provider [${provider}] with code [${code}].`);
  const getUser = getProvider(provider).getUser(code);
  const setLogin = getUser.then(user => loginModel.set({ session, provider, user }));
  const getUserUrl = getUser.then(user => `/${provider}/${user}`);
  return Promise.all([getUserUrl, setLogin]).then(([url]) => url);
}
