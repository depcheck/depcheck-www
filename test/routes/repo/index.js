/* global describe, it */

import 'should';
import urls from '../../utils/urls';
import route from '../../utils/route';
import mockFunction from '../../utils/mock-function';

describe('route repo index', () => {
  it('should call and return repo basic information', () => {
    const info = {
      provider: 'routes',
      user: 'tester',
    };

    const query = mockFunction([
      {
        name: 'enable-1',
        token: 'token-1',
      },
      {
        name: 'enable-2',
        token: 'token-2',
      },
      {
        name: 'enable-3',
        token: 'token-3',
      },
      {
        name: 'disable-1',
      },
      {
        name: 'disable-2',
      },
      {
        name: 'project-3',
        invalid: true,
      },
    ]);

    const repo = route('repo/index', {
      '../../models/login': {
        validate: () => Promise.resolve(),
      },
      '../../models/repo': {
        query,
      },
    });

    return repo.model({ urls, params: info })
    .then(model => {
      model.should.have.properties(info);
      model.should.have.property('enabled').have.length(3);
      model.should.have.property('disabled').have.length(2);
      model.should.have.property('invalid').have.length(1);

      model.enabled[0].should.have.properties({
        enabled: true,
        token: undefined,
      }).and.have.properties([
        'repoUrl',
        'badgeUrl',
      ]);
    })
    .then(() =>
      query.calls[0][0].should.have.properties(info));
  });
});
