import * as tokenModel from './token';
import { logger } from '../services';

export function query({ provider, user }) {
  logger.debug(`[model:repo] query repo list with provider [${provider}] and user [${user}].`);
  const queryToken = tokenModel.query({ provider, user });

  // TODO request all packages from provider (e.g., Github)
  return Promise.all([queryToken])
  .then(([token]) => token);
}
