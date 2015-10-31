import { logger } from '../../services';
import { getProvider } from '../../providers';

export const route = '/login/:provider';

export function redirect({ params: { provider } }) {
  logger.debug(`[routes:login] prepare login redirect URL from provider [${provider}].`);
  return getProvider(provider).getLoginUrl();
}
