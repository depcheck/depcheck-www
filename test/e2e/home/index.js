/* global describe, it */

import request from '../../utils/request';

describe('/', () => {
  it('should render login link if user not login yet', done =>
    request('home', {
      '../../models/login': {
        getUser() {
          return null;
        },
      },
    })
    .get('/')
    .expect(200)
    .expect(/Depcheck Web Service/)
    .expect(/Login/)
    .end(done));

  it('should render welcome and go to repo link if user login', done =>
    request('home', {
      '../../models/login': {
        getUser() {
          return {
            provider: 'e2e',
            user: 'tester',
          };
        },
      },
    })
    .get('/')
    .expect(200)
    .expect(/Hello tester/)
    .expect(/my repo/)
    .end(done));
});
