/* global describe, it */

import 'should';
import view from '../utils/view';

describe('view repo', () => {
  it('should render repo report page with report details', () => {
    const query = view('repo', {
      provider: 'views',
      user: 'tester',
      repo: 'project',
      reports: [
        {
          branch: 'master',
          report: '',
          dependencies: ['unused-dep'],
          devDependencies: ['unused-devDep'],
        },
      ],
    });

    query('h1').text().should.containEql('project');
    query('h4').text().should.containEql('views/tester');

    const masterReport = query('ul li').eq(0);
    masterReport.should.be.ok();
    masterReport.find('p').eq(0).text().should.containEql('master');
    masterReport.find('div ul').eq(0).text().should.containEql('unused-dep');
    masterReport.find('div ul').eq(1).text().should.containEql('unused-devDep');
  });
});
