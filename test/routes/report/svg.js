/* global describe, it */

import 'should';
import route from '../../utils/route';
import mockFunction from '../../utils/mock-function';

const params = {
  provider: 'routes',
  user: 'tester',
  repo: 'project',
  branch: 'master',
};

describe('route report svg', () => {
  it('should return passing view model if no unused dependencies', () => {
    const query = mockFunction([{
      dependencies: [],
      devDependencies: [],
    }]);

    const report = route('report/svg', {
      '../../models/report': {
        query,
      },
    });

    return report.model({ params })
    .then(model => model.should.have.properties({
      caption: 'passing',
      color: '#4c1',
    }));
  });

  it('should return failing view model if exist unused dependencies', () => {
    const query = mockFunction([{
      dependencies: ['unused-dep'],
      devDependencies: [],
    }]);

    const report = route('report/svg', {
      '../../models/report': {
        query,
      },
    });

    return report.model({ params })
    .then(model => model.should.have.properties({
      caption: 'failing',
      color: '#e05d44',
    }));
  });

  it('should return unknown view model if no dependencies information', () => {
    const query = mockFunction([]);
    const report = route('report/svg', {
      '../../models/report': {
        query,
      },
    });

    return report.model({ params })
    .then(model => model.should.have.properties({
      caption: 'unknown',
      color: '#9f9f9f',
    }));
  });

  it('should set report default value to empty string', () => {
    const query = mockFunction([]);
    const report = route('report/svg', {
      '../../models/report': {
        query,
      },
    });

    return report.model({ params })
    .then(() =>
      query.calls[0][0].should.have.properties(params)
        .and.have.property('report', ''));
  });
});
