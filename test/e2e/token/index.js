/* global describe, it */

import stub from '../../utils/stub';
import mockFunction from '../../utils/mock-function';

describe('/token/provider/user/repo', () =>
  it('should post to create a token', done => {
    const insert = mockFunction((tableName, record) => record);

    stub({
      session: {
        login: {
          provider: 'e2e',
          user: 'tester',
        },
      },
      table: { insert },
    })
    .post('/token/e2e/tester/project')
    .set('Referer', '/e2e/tester')
    .expect(302)
    .expect('Location', '/e2e/tester')
    .expect(() => {
      insert.calls[0][0].should.equal('token');
      insert.calls[0][1].should.have.properties('token')
        .and.have.properties({
          provider: 'e2e',
          user: 'tester',
          repo: 'project',
        });
    })
    .end(done);
  }));
