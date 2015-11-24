/* global describe, it */

import 'should';
import stub from '../../utils/stub';

describe('/login/test/callback', () =>
  it('should redirect to login user page', done => {
    const session = {};

    stub({
      session,
      providers: {
        getAccessToken: code => Promise.resolve(`access-token-${code}`),
        getUser: accessToken => Promise.resolve(`tester-${accessToken}`),
      },
    })
    .get('/login/e2e/callback?code=123')
    .expect(302)
    .expect('Location', '/e2e/tester-access-token-123')
    .expect(() => session.login.should.be.ok())
    .expect(() => session.accessToken.should.equal('access-token-123'))
    .end(done);
  }));
