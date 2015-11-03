/* global describe, it */

import 'should';
import view from '../utils/view';

describe('view navbar', () => {
  it('should render navbar', () => {
    const query = view('navbar', {});

    const anchors = query('a');

    const homeAnchor = anchors.eq(0);
    homeAnchor.text().should.equal('Home');
    homeAnchor.attr('href').should.equal('/');

    const tutorialAnchor = anchors.eq(1);
    tutorialAnchor.text().should.equal('Tutorial');
    tutorialAnchor.attr('href').should.equal('/tutorial');

    const githubAnchor = anchors.eq(2);
    githubAnchor.text().should.equal('GitHub');
    githubAnchor.attr('href').should.equal('https://github.com/lijunle/depcheck-web');
  });
});
