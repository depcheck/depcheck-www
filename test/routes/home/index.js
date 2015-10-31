/* global describe, it */

import 'should';
import route from '../../utils/route';

describe('route home', () => {
  it('should return empty object if not login', () => {
    const home = route('home', {
      '../../models/login': {
        getUser() {
          return null;
        },
      },
    });

    return home.model({}).then(result => result.should.eql({}));
  });

  it('should return login information if login', () => {
    const login = {
      provider: 'routes',
      user: 'tester',
    };

    const home = route('home', {
      '../../models/login': {
        getUser() {
          return login;
        },
      },
    });

    return home.model({}).then(result => {
      result.login.should.eql(login);
      result.url.repoList.should.not.be.empty();
    });
  });
});
