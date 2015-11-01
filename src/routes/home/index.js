import * as loginModel from '../../models/login';
import { logger } from '../../services';
import { url as repoUrl } from '../repo';

export const route = '/';

export const view = 'home';

export const model = ({ session }) => {
  const login = loginModel.getUser(session);
  logger.debug(`[routes:home] get login user ${JSON.stringify(login)}`);

  return Promise.resolve({
    login,
    repoListUrl: login ? repoUrl(login) : null,
  });
};
