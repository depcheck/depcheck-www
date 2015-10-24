import * as loginModel from '../../models/login';
import { logger } from '../../services';

export const route = '/';

export const view = 'index';

export const model = ({ session }) => {
  const login = loginModel.getUser(session);
  logger.debug(`[routes:home] get login user ${JSON.stringify(login)}`);

  return !login
  ? {}
  : {
    login,
    url: {
      repoList: `/${login.provider}/${login.user}`,
    },
  };
};
