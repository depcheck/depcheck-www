/* global describe, it */

import 'should';
import view from '../utils/view';

describe('view home', () => {
  it('should render login URL when no login information', () => {
    const query = view('home', {});

    const caption = query('body h1');
    caption.text().should.equal('Depcheck Web Service');

    const anchor = query('body a');
    anchor.attr('href').should.equal('/login/github');
    anchor.text().should.match(/^login/i);
  });

  it('should render go to my repo link when login information', () => {
    const properties = {
      login: {
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
    paragraph.text().should.match(/hello tester/i);
  });
});
