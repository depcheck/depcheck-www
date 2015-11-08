/* global describe, it */

import stub from '../../utils/stub';

describe('/tutorial', () => {
  it('should render login link if user not login yet', done =>
    stub({})
    .get('/tutorial')
    .expect(200)
    .expect(/Tutorial/)
    .expect(/Depcheck/)
    .end(done));
});
