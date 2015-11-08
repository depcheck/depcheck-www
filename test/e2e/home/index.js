/* global describe, it */

import stub from '../../utils/stub';

describe('/', () => {
  it('should render login link if user not login yet', done =>
    stub({
      session: {
        login: null,
      },
    })
    .get('/')
    .expect(200)
    .expect(/Depcheck/)
    .expect(/Login/)
    .end(done));

  it('should render welcome and go to repo link if user login', done =>
    stub({
      session: {
        login: {
          provider: 'e2e',
          user: 'tester',
        },
      },
    })
    .get('/')
    .expect(200)
    .expect(/e2e\/tester/)
    .end(done));
});
