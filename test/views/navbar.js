/* global describe, it */

import 'should';
import view from '../utils/view';

const urls = {
  homeUrl: '/',
  tutorialUrl: '/tutorialUrl',
};

describe('view navbar', () => {
  it('should render navbar', () => {
    const query = view('navbar', { ...urls });

    const anchors = query('a');

    const homeAnchor = anchors.eq(0);
    homeAnchor.text().should.equal('Home');
    homeAnchor.attr('href').should.equal(urls.homeUrl);

    const tutorialAnchor = anchors.eq(1);
    tutorialAnchor.text().should.equal('Tutorial');
    tutorialAnchor.attr('href').should.equal(urls.tutorialUrl);

    const githubAnchor = anchors.eq(2);
    githubAnchor.text().should.equal('GitHub');
    githubAnchor.attr('href').should.equal('https://github.com/lijunle/depcheck-web');
  });

  it('should render repository link if present', () => {
    const repoUrl = '/repo';
    const query = view('navbar', { ...urls, repoUrl });

    const anchors = query('a');

    const homeAnchor = anchors.eq(1);
    homeAnchor.text().should.equal('Repository');
    homeAnchor.attr('href').should.equal(repoUrl);

    const tutorialAnchor = anchors.eq(2);
    tutorialAnchor.text().should.equal('Tutorial');
    tutorialAnchor.attr('href').should.equal(urls.tutorialUrl);
  });
});
