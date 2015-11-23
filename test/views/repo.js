/* global describe, it */

import 'should';
import view from '../utils/view';

const info = {
  provider: 'views',
  user: 'tester',
  repo: 'project',
  hasAccess: true,
  token: 'project-token',
  reports: [],
};

describe('view repo', () => {
  it('should render repo info', () => {
    const query = view('repo', info);

    query('h1').text().should.equal('project');
    query('h5').text().should.equal('from views/tester');
  });

  it('should render token if enabled and user has access', () => {
    const query = view('repo', {
      ...info,
      hasAccess: true,
      token: 'project-token',
    });

    query('code').text().should.equal('project-token');
  });

  it('should not render token if enabled but user not has access', () => {
    const query = view('repo', {
      ...info,
      hasAccess: false,
      token: 'project-token',
    });

    query('code').should.have.length(0);
  });

  it('should render request button if not enabled and user has access', () => {
    const query = view('repo', {
      ...info,
      hasAccess: true,
      token: null,
    });

    query('p').text().should.containEql('not enabled').and.containEql('button');
    query('input').val().should.equal('Enable Depcheck');
  });

  it('should render hint if not enabled but user not has access', () => {
    const query = view('repo', {
      ...info,
      hasAccess: false,
      token: null,
    });

    query('p').text().should.containEql('not enabled');
  });

  it('should render repo report page with report details', () => {
    const query = view('repo', {
      ...info,
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
      ...info,
      hasAccess: true,
      token: undefined,
      tokenUrl: '/request/project/token',
    });

    query('code').should.have.length(0);
    query('form').attr('action').should.equal('/request/project/token');
    query('form > input').attr('type').should.equal('submit');
    query('form > input').val().should.equal('Enable Depcheck');
  });
});
