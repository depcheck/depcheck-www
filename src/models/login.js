import getProvider from '../providers';
import { logger } from '../services';

export function getLoginUrl({ provider }) {
  logger.debug(`[model:login] generate login URL from provider [${provider}].`);
  return getProvider(provider).getLoginUrl();
}

export function callback({ provider }, { code }) {
  // TODO setup cookies for latter authentication
  logger.debug(`[model:login] get login callback from provider [${provider}] with code [${code}].`);
  return getProvider(provider).getUserUrl(code);
}
