/* global describe, it */

import 'should';
import view from '../utils/view';

describe('view repo', () => {
  it('should render repo info', () => {
    const query = view('repo', {
      provider: 'views',
      user: 'tester',
      repo: 'project',
      token: 'project-token',
      reports: [],
    });

    query('h1').text().should.equal('project');
    query('h5').text().should.equal('from views/tester');
    query('code').text().should.equal('project-token');
  });

  it('should render repo report page with report details', () => {
    const query = view('repo', {
      provider: 'views',
      user: 'tester',
      repo: 'project',
      token: 'project-token',
      reports: [
        {
          caption: 'master',
          branch: 'master',
          report: '',
          dependencies: ['unused-dep'],
          devDependencies: ['unused-devDep'],
          badgeUrl: '/badge/master',
        },
        {
          caption: 'master/passing',
          branch: 'master',
          report: 'passing',
          dependencies: [],
          devDependencies: [],
          badgeUrl: '/badge/master/passing',
        },
      ],
    });

    const masterReport = query('ul li').eq(0);
    masterReport.should.be.ok();
    masterReport.find('.panel-heading').text().trim()
      .should.containEql('master');
    masterReport.find('.panel-heading img').attr('src')
      .should.equal('/badge/master');
    masterReport.find('p').eq(0).text()
      .should.containEql('unused-dep');
    masterReport.find('p').eq(1).text()
      .should.containEql('unused-devDep');

    const passReport = query('ul li').eq(1);
    passReport.should.be.ok();
    passReport.find('.panel-body').text()
      .should.containEql('no unused dependencies');
  });

  it('should render request token button if not enabled', () => {
    const query = view('repo', {
      provider: 'views',
      user: 'tester',
      repo: 'project',
      token: undefined,
      tokenUrl: '/request/project/token',
      reports: [],
    });

    query('code').should.have.length(0);
    query('form').attr('action').should.equal('/request/project/token');
    query('form > input').attr('type').should.equal('submit');
    query('form > input').val().should.equal('Enable Depcheck');
  });
});
