/* global describe, it */

import stub from '../../utils/stub';

describe('/token/provider/user/repo', () =>
  it('should post to create a token', done => {
    const insert = [];

    stub({
      session: {
        login: '/e2e/tester',
      },
      table: {
        insert,
      },
    })
    .post('/token/e2e/tester/project')
    .set('Referer', '/e2e/tester')
    .expect(302)
    .expect('Location', '/e2e/tester')
    .expect(() => {
      insert[0].tableName.should.equal('token');
      insert[0].record.should.have.properties('token')
        .and.have.properties({
          provider: 'e2e',
          user: 'tester',
          repo: 'project',
        });
    })
    .end(done);
  }));
