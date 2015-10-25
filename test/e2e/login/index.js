/* global describe, it */

import stub from '../../utils/stub';

describe('/login/test', () =>
  it('should redirect to login page', done =>
    stub({
      providers: {
        getLoginUrl: () => Promise.resolve('http://test/login'),
      },
    })
    .get('/login/test')
    .expect(302)
    .expect('Location', 'http://test/login')
    .end(done)));
