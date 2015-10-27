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
});
