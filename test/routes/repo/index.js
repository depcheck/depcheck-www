/* global describe, it */

import 'should';
import route from '../../utils/route';
import mockFunction from '../../utils/mock-function';

describe('route repo index', () => {
  it('should call and return repo basic information', () => {
    const info = {
      provider: 'routes',
      user: 'tester',
    };

    const query = mockFunction([
      { name: 'project-1' },
      { name: 'project-2' },
      { name: 'project-3' },
    ]);

    const repo = route('repo/index', {
      '../../models/login': {
        validate: () => Promise.resolve(),
      },
      '../../models/repo': {
        query,
      },
    });

    return repo.model({ params: info })
    .then(model =>
      model.should.have.properties(info)
        .and.have.property('repos').have.length(3))
    .then(() =>
      query.calls[0][0].should.have.properties(info));
  });
});
