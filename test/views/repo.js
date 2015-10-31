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
          caption: 'master',
          branch: 'master',
          report: '',
          dependencies: ['unused-dep'],
          devDependencies: ['unused-devDep'],
          badgeUrl: '/badge/master',
        },
      ],
    });

    query('h1').text().should.equal('project');
    query('h5').text().should.equal('from views/tester');

    const masterReport = query('ul li').eq(0);
    masterReport.should.be.ok();
    masterReport.find('.panel-heading').text().trim().should.containEql('master');
    masterReport.find('p').eq(0).text().should.containEql('unused-dep');
    masterReport.find('p').eq(1).text().should.containEql('unused-devDep');
  });
});
