import * as loginModel from '../../models/login';
import { logger } from '../../services';

export const route = '/';

export const view = 'home';

export const model = ({ session, urls }) => {
  const login = loginModel.getUser(session);
  logger.debug(`[routes:home] get login user ${JSON.stringify(login)}`);

  return Promise.resolve({
    login,
    repoListUrl: login ? urls.repo.index(login) : null,
  });
};
