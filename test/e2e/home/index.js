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
    .expect(/Depcheck Web Service/)
    .expect(/Login/)
    .end(done));

  it('should render welcome and go to repo link if user login', done =>
    stub({
      session: {
        login: '/github/tester',
      },
    })
    .get('/')
    .expect(200)
    .expect(/Hello tester/)
    .expect(/my repo/)
    .end(done));
});
