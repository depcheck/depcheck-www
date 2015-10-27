/* global describe, it */

import 'should';
import stub from '../../utils/stub';
import mockFunction from '../../utils/mock-function';

describe('/provider/user/repo', () => {
  it('should render the repo page', done => {
    const query = mockFunction([{
      branch: 'master',
      report: 'passing',
      dependencies: JSON.stringify(['unused-dep']),
      devDependencies: JSON.stringify(['unused-devDep']),
    }]);

    stub({
      session: {
        login: '/e2e/tester',
      },
      table: {
        query,
      },
    })
    .get('/e2e/tester/project')
    .expect(200)
    .expect(/master/)
    .expect(/passing/)
    .expect(/unused-dep/)
    .expect(/unused-devDep/)
    .expect(() => {
      query.calls[0][0].should.equal('report');
      query.calls[0][1].filter.should.have.properties({
        provider: 'e2e',
        user: 'tester',
        repo: 'project',
      });
    })
    .end(done);
  });

  it('should create a new report when post with valid token', done => {
    const query = mockFunction([{
      provider: 'e2e',
      user: 'tester',
      repo: 'project',
      token: 'security-token',
    }]);

    const upsert = mockFunction((tableName, record) => record);

    stub({
      table: {
        query,
        upsert,
      },
    })
    .post('/e2e/tester/project')
    .set('Accept', 'application/json')
    .send({
      token: 'security-token',
      branch: 'test',
      report: 'new',
      result: {
        dependencies: ['dep'],
        devDependencies: ['devDep'],
      },
    })
    .expect(200)
    .expect(res => res.body.should.have.properties({
      provider: 'e2e',
      user: 'tester',
      repo: 'project',
      branch: 'test',
      report: 'new',
      dependencies: JSON.stringify(['dep']),
      devDependencies: JSON.stringify(['devDep']),
    }))
    .expect(() => {
      query.calls[0][0].should.equal('token');
      query.calls[0][1].limit.should.equal(1);
      query.calls[0][1].filter.should.property('id');
    })
    .expect(() => {
      upsert.calls[0][0].should.equal('report');
      upsert.calls[0][1].should.have.properties({
        provider: 'e2e',
        user: 'tester',
        repo: 'project',
        branch: 'test',
        report: 'new',
        dependencies: JSON.stringify(['dep']),
        devDependencies: JSON.stringify(['devDep']),
      });
    })
    .end(done);
  });
});
