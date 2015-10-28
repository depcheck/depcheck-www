/* global describe, it */

import 'should';
import stub from '../../utils/stub';
import mockFunction from '../../utils/mock-function';

describe('/provider/user', () =>
  it('should render repo list for the tester', done => {
    const tableQuery = mockFunction([{
      provider: 'e2e',
      user: 'tester',
      repo: 'project',
      token: 'project-token',
    }]);

    const providerQuery = mockFunction([
      {
        name: 'project',
        description: 'This is test project',
      },
      {
        name: 'another-project',
        description: 'This is another project',
      },
    ]);

    stub({
      session: {
        login: '/e2e/tester',
      },
      table: {
        query: tableQuery,
      },
      providers: {
        query: providerQuery,
      },
    })
    .get('/e2e/tester')
    .expect(200)
    .expect(/e2e\/tester/)
    .expect(/project/)
    .expect(/This is test project/)
    .expect(/another-project/)
    .expect(/This is another project/)
    .expect(() => {
      providerQuery.calls[0][0].should.equal('tester');
      tableQuery.calls[0][0].should.equal('token');
      tableQuery.calls[0][1].filter.should.have.properties({
        provider: 'e2e',
        user: 'tester',
      });
    })
    .end(done);
  }));
