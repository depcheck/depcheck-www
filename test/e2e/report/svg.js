/* global describe, it */

import stub from '../../utils/stub';

function tableQuery(records) {
  const calls = [];

  function query(tableName, { filter }) {
    calls.push({ tableName, filter });
    return Promise.resolve(records);
  }

  query.calls = calls;
  return query;
}

describe('/provider/user/repo/branch.svg', () => {
  it('should get a passing badge for report without unused dependencies', done => {
    const query = tableQuery([{
      provider: 'e2e',
      user: 'tester',
      repo: 'project',
      branch: 'master',
      report: '',
      dependencies: JSON.stringify([]),
      devDependencies: JSON.stringify([]),
    }]);

    stub({
      table: { query },
    })
    .get('/e2e/tester/project/master.svg')
    .expect(200)
    .expect(res => res.text = res.body.toString('utf8'))
    .expect(/^<svg/)
    .expect(/>passing</)
    .expect(() => {
      query.calls[0].tableName.should.equal('report');
      query.calls[0].filter.should.have.properties({
        provider: 'e2e',
        user: 'tester',
        repo: 'project',
      });
    })
    .end(done);
  });

  it('should get a failing badge for report with unused dependencies', done => {
    const query = tableQuery([{
      provider: 'e2e',
      user: 'tester',
      repo: 'project',
      branch: 'failing',
      report: '',
      dependencies: JSON.stringify(['unused-dep']),
      devDependencies: JSON.stringify([]),
    }]);

    stub({
      table: { query },
    })
    .get('/e2e/tester/project/failing.svg')
    .expect(200)
    .expect(res => res.text = res.body.toString('utf8'))
    .expect(/^<svg/)
    .expect(/>failing</)
    .expect(() => {
      query.calls[0].tableName.should.equal('report');
      query.calls[0].filter.should.have.properties({
        provider: 'e2e',
        user: 'tester',
        repo: 'project',
      });
    })
    .end(done);
  });

  it('should get an unknown badge for report which not exists', done => {
    const query = tableQuery([]);

    stub({
      table: { query },
    })
    .get('/e2e/tester/project/unknown.svg')
    .expect(200)
    .expect(res => res.text = res.body.toString('utf8'))
    .expect(/^<svg/)
    .expect(/>unknown</)
    .expect(() => {
      query.calls[0].tableName.should.equal('report');
      query.calls[0].filter.should.have.properties({
        provider: 'e2e',
        user: 'tester',
        repo: 'project',
      });
    })
    .end(done);
  });
});
