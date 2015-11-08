/* global describe, it */

import 'should';
import view from '../utils/view';

const data = {
  provider: 'views',
  user: 'tester',
  enabled: [
    {
      name: 'project-1',
      description: 'description-1',
      repoUrl: '/project/1',
      enabled: true,
      badgeUrl: '/project/1/master.svg',
    },
  ],
  disabled: [
    {
      name: 'project-2',
      description: 'description-2',
      repoUrl: '/project/2',
    },
  ],
  invalid: [
    {
      name: 'project-3',
      repoUrl: '/project/3',
      invalid: true,
    },
  ],
};

describe('view repo list', () => {
  it('should render repo list', () => {
    const query = view('repo-list', data);

    query('h1').text().should.equal('Repository');
    query('h5 > mark').text().should.match(/views\/tester/);

    query('h3').text().should.equal('Invalid Repositories');
    query('h3 ~ p').text().should.containEql('removed from views')
      .and.containEql('invalid');

    query('ul > li').length.should.equal(3);
    query('ul').eq(0).find('li').length.should.equal(1);
    query('ul').eq(1).find('li').length.should.equal(1);
    query('ul').eq(2).find('li').length.should.equal(1);
  });

  it('should render repo badge if enabled', () => {
    const query = view('repo-list', data);
    const repoItem = query('li').eq(0);

    repoItem.find('h4').text().trim().should.equal('project-1');
    repoItem.find('h4 > a').attr('href').should.equal('/project/1');
    repoItem.find('h4 img').attr('src').should.equal('/project/1/master.svg');
    repoItem.find('p').text().should.equal('description-1');
  });

  it('should not render repo badge if disabled', () => {
    const query = view('repo-list', data);
    const repoItem = query('li').eq(1);

    repoItem.find('h4').text().should.equal('project-2');
    repoItem.find('h4 > a').attr('href').should.equal('/project/2');
    repoItem.find('h4 img').should.length(0);
    repoItem.find('p').text().should.equal('description-2');
  });

  it('should not render repo description if invalid', () => {
    const query = view('repo-list', data);
    const repoItem = query('li').eq(2);

    repoItem.find('h4').text().should.equal('project-3');
    repoItem.find('h4 > a').attr('href').should.equal('/project/3');
    repoItem.find('p').text().should.equal('');
  });

  it('should not render invalid repository section if no invalid', () => {
    const query = view('repo-list', { ...data, invalid: [] });

    query('h3').should.have.length(0);
  });
});
