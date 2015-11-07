/* global describe, it */

import 'should';
import layout from '../../src/routes/layout';
import urls from '../utils/urls';

const session = {
  login: {
    provider: 'routes',
    user: 'tester',
  },
};

describe('route layout', () => {
  it('should return common URLs from layout', () =>
    layout({ urls }).should.have.properties({
      homeUrl: '/',
      tutorialUrl: '/tutorial',
    }));

  it('should return repository URL if logged in', () =>
    layout({ urls, session }).should.have.properties({
      repoUrl: '/routes/tester',
    }));
});
