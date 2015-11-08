/* global describe, it */

import 'should';
import stub from '../../utils/stub';
import mockFunction from '../../utils/mock-function';

describe('/provider/user/repo', () => {
  it('should render the repo page', done => {
    const query = mockFunction(tableName =>
      tableName === 'report'
      ? [{
        branch: 'master',
        report: 'passing',
        dependencies: JSON.stringify(['unused-dep']),
        devDependencies: JSON.stringify(['unused-devDep']),
      }]
      : ['project-token']);

    stub({
      session: {
        login: {
          provider: 'e2e',
          user: 'tester',
        },
      },
      table: {
        query,
      },
    })
    .get('/e2e/tester/project')
    .expect(200)
    .expect(/project/)
    .expect(/e2e\/tester/)
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
      query.calls[1][0].should.equal('token');
      query.calls[1][1].should.have.properties({ limit: 1 })
        .and.have.property('filter').have.property('id');
    })
    .end(done);
  });

  it('should render repo page to request token', done => {
    const query = mockFunction([]);

    stub({
      session: {
        login: {
          provider: 'e2e',
          user: 'tester',
        },
      },
      table: {
        query,
      },
    })
    .get('/e2e/tester/project')
    .expect(200)
    .expect(/not enabled/)
    .expect(/Enable Depcheck/)
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

  it('should reject new report when token is invalid', done =>
    stub({
      table: {
        query: mockFunction([{
          provider: 'e2e',
          user: 'tester',
          repo: 'project',
          token: 'security-token',
        }]),
      },
    })
    .post('/e2e/tester/project')
    .set('Accept', 'application/json')
    .send({
      token: 'hack-token',
      branch: 'test',
      report: 'new',
      result: {
        dependencies: [],
        devDependencies: [],
      },
    })
    .expect(401)
    .expect(res => {
      res.body.should.have.properties(['id', 'message']);
      res.body.id.should.not.be.empty();
      res.body.message.should.not.be.empty();
    })
    .end(done));

  it('should reject report and handle unexpected error when happens', done =>
    stub({
      table: {
        query: mockFunction(() => Promise.reject(new Error('unexpected'))),
      },
    })
    .post('/e2e/tester/project')
    .set('Accept', 'application/json')
    .send({
      token: 'hack-token',
      branch: 'test',
      report: 'new',
      result: {
        dependencies: [],
        devDependencies: [],
      },
    })
    .expect(500)
    .expect(res => {
      res.body.should.have.properties(['id', 'message']);
      res.body.id.should.not.be.empty();
      res.body.message.should.equal('Unexpected error happens.');
    })
    .end(done));
});
