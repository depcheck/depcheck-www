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

    const result = home.model({});
    result.should.eql({});
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

    const result = home.model({});
    result.login.should.eql(login);
    result.url.repoList.should.not.be.empty();
  });
});
