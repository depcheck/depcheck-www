/* global describe, it */

import 'should';
import view from '../utils/view';

describe('view home', () => {
  it('should render caption, introduction and logo', () => {
    const query = view('home', {});

    const caption = query('body > h1');
    caption.text().should.equal('Depcheck');

    const introduction = query('.row p');
    introduction.text().should.containEql('Depcheck')
      .and.containEql('unused dependencies');

    const logo = query('body img');
    logo.attr('src').should.containEql('logo');
    logo.attr('alt').should.equal('Depcheck Logo');
  });

  it('should render login URL when no login information', () => {
    const query = view('home', {});

    const button = query('body a.btn');
    button.attr('href').should.equal('/login/github');
    button.text().should.containEql('Login').and.containEql('GitHub');
  });

  it('should render go to my repo link when login information', () => {
    const properties = {
      login: {
        provider: 'views',
        user: 'tester',
      },
      url: {
        repoList: '/repo/list',
      },
    };

    const query = view('home', properties);

    const anchor = query('body a');
    anchor.attr('href').should.equal(properties.url.repoList);

    const paragraph = query('body p');
    paragraph.text().should.containEql('Logged in')
      .and.containEql('views/tester')
      .and.containEql('repository list');
  });
});
