/* global describe, it */

import 'should';
import urls from '../../utils/urls';
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
    const get = mockFunction('project-token');

    const repo = route('repo/report', {
      '../../models/login': {
        validate,
      },
      '../../models/report': {
        query,
      },
      '../../models/token': {
        get,
      },
    });

    return repo.model({ urls, params: info })
    .then(model => model.should.have.properties(info)
      .and.have.properties({ token: 'project-token' })
      .and.have.property('reports').have.length(0))
    .then(() => query.calls[0][0].should.have.properties(info));
  });

  it('should return the reports', () => {
    const validate = mockFunction();
    const get = mockFunction('project-token');
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
      '../../models/token': {
        get,
      },
    });

    return repo.model({ urls, params: info })
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

  it('should set token properly when repo not enabled', () => {
    const validate = mockFunction();
    const query = mockFunction([]);
    const get = mockFunction(() => Promise.reject('not enabled'));

    const repo = route('repo/report', {
      '../../models/login': {
        validate,
      },
      '../../models/report': {
        query,
      },
      '../../models/token': {
        get,
      },
    });

    return repo.model({ urls, params: info })
    .then(model => model.should.have.properties({
      token: undefined,
      tokenUrl: '/token/routes/tester/project',
    }));
  });
});
