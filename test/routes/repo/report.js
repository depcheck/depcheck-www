/* global describe, it */

import 'should';
import route from '../../utils/route';
import mockFunction from '../../utils/mock-function';

const info = {
  provider: 'routes',
  user: 'tester',
  repo: 'project',
};

describe('route repo report', () => {
  it('should call and return repo basic information', () => {
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
    const validate = mockFunction();
    const query = mockFunction([
      {
        branch: 'branch-1',
        report: 'report-1',
      },
      {
        branch: 'branch-2',
        report: '',
      },
    ]);

    const repo = route('repo/report', {
      '../../models/login': {
        validate,
      },
      '../../models/report': {
        query,
      },
    });

    return repo.model({ params: info })
    .then(model => {
      model.reports.should.have.length(2);

      model.reports[0].should.have.properties({
        branch: 'branch-1',
        report: 'report-1',
        caption: 'branch-1/report-1',
        badgeUrl: '/routes/tester/project/branch-1/report-1.svg',
      });

      model.reports[1].should.have.properties({
        branch: 'branch-2',
        report: '',
        caption: 'branch-2',
        badgeUrl: '/routes/tester/project/branch-2.svg',
      });
    });
  });
});
