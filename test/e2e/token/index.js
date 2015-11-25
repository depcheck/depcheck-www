/* global describe, it */

import stub from '../../utils/stub';
import mockFunction from '../../utils/mock-function';

describe('/token/provider/user/repo', () => {
  it('should post to create a token', done => {
    const getRepos = mockFunction(['tester/project']);
    const insert = mockFunction((tableName, record) => record);

    stub({
      session: {
        accessToken: 'tester-access-token',
        login: {
          provider: 'e2e',
          user: 'tester',
        },
      },
      providers: {
        getRepos,
      },
      table: {
        insert,
      },
    })
    .post('/token/e2e/tester/project')
    .set('Accept', 'text/html')
    .set('Referer', '/e2e/tester')
    .expect(302)
    .expect('Location', '/e2e/tester')
    .expect(() => getRepos.calls[0][0].should.equal('tester-access-token'))
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
  });

  it('should reject the request when not have access to repo', done =>
    stub({
      session: {
        accessToken: 'tester-access-token',
        login: {
          provider: 'e2e',
          user: 'tester',
        },
      },
      providers: {
        getRepos: mockFunction(['no/project']),
      },
    })
    .post('/token/e2e/tester/project')
    .set('Accept', 'text/html')
    .set('Referer', '/e2e/tester')
    .expect(401)
    .expect(res =>
      res.body.message.should.containEql('e2e/tester')
        .and.containEql('no access')
        .and.containEql('tester/project'))
    .end(done));
});
