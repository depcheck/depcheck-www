/* global describe, it */

import 'should';
import route from '../../utils/route';
import mockFunction from '../../utils/mock-function';

describe('route repo report', () => {
  it('should call and return repo basic information', () => {
    const info = {
      provider: 'routes',
      user: 'tester',
      repo: 'project',
    };

    const validate = mockFunction();
    const query = mockFunction([]);

    const repo = route('repo/report', {
      '../../models/login': {
        validate,
      },
      '../../models/report': {
        query,
      },
    });

    return repo.model({ params: info })
    .then(model => model.should.have.properties(info))
    .then(() => query.calls[0][0].should.have.properties(info));
  });

  it('should return the reports', () => {
    const reports = [
      'report-1',
      'report-2',
    ];

    const validate = mockFunction();
    const query = mockFunction(reports);

    const repo = route('repo/report', {
      '../../models/login': {
        validate,
      },
      '../../models/report': {
        query,
      },
    });

    return repo.model({ params: {} })
    .then(model => model.should.have.property('reports', reports));
  });
});
