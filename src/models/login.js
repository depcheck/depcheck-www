import getProvider from '../providers';
import { logger } from '../services';

export function getLoginUrl({ provider }) {
  logger.debug(`[model:login] generate login URL from provider [${provider}].`);
  return getProvider(provider).getLoginUrl();
}
