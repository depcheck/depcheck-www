/* global describe, it */

import 'should';
import view from '../utils/view';

const data = {
  provider: 'views',
  user: 'tester',
  repos: [
    {
      name: 'project-1',
      description: 'description-1',
      token: 'token-1',
      repoUrl: '/project/1',
      requestTokenUrl: '/token/project/1',
    },
    {
      name: 'project-2',
      description: 'description-2',
      token: 'token-2',
      repoUrl: '/project/2',
      requestTokenUrl: '/token/project/2',
    },
    {
      name: 'project-3',
      description: 'description-3',
      repoUrl: '/project/3',
      requestTokenUrl: '/token/project/3',
    },
  ],
};

describe('view repo list', () => {
  it('should render repo list', () => {
    const query = view('repo-list', data);

    query('h1').text().should.equal('Repo List');
    query('p').text().should.match(/views\/tester/);
    query('ul > li').length.should.equal(data.repos.length);
  });

  it('should render repo token if present', () => {
    const query = view('repo-list', data);
    const repoItem = query('li').eq(0);

    repoItem.find('h4').text().should.equal('project-1');
    repoItem.find('h4 > a').attr('href').should.equal('/project/1');
    repoItem.find('p').text().should.equal('description-1');
    repoItem.find('code').text().should.equal('token-1');
  });

  it('should render enable token button if token not present', () => {
    const query = view('repo-list', data);
    const repoItem = query('li').eq(2);

    repoItem.find('h4').text().should.equal('project-3');
    repoItem.find('p').text().should.equal('description-3');
    repoItem.find('code').should.have.length(0);
    repoItem.find('form').attr('action').should.equal('/token/project/3');
    repoItem.find('form > input').attr('type').should.equal('submit');
    repoItem.find('form > input').val().should.equal('Enable');
  });
});
