/* global describe, it */

import 'should';
import stub from '../../utils/stub';

describe('/login/test/callback', () =>
  it('should redirect to login user page', done => {
    const session = {};

    stub({
      session,
      providers: {
        getUser: (code) => Promise.resolve(`tester-${code}`),
      },
    })
    .get('/login/e2e/callback?code=123')
    .expect(302)
    .expect('Location', '/e2e/tester-123')
    .expect(() => session.login.should.be.ok())
    .end(done);
  }));
