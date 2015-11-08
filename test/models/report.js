/* global describe, it */

import 'should';
import lodash from 'lodash';
import model from '../utils/model';
import mockFunction from '../utils/mock-function';

const report = {
  provider: 'models',
  user: 'tester',
  repo: 'project',
  branch: 'master',
  report: '',
  result: {
    dependencies: ['dep'],
    devDependencies: ['devDep'],
  },
};

describe('model report', () => {
  it('should upsert record to report table', () => {
    const tableUpsert = mockFunction({
      'report': true,
    });

    const reportModel = model('report', {
      '../services': {
        table: {
          upsert: tableUpsert,
        },
      },
    });

    return reportModel.upsert(report)
    .then(result => result.should.have.property('report', true))
    .then(() => {
      tableUpsert.calls[0][0].should.equal('report');
      tableUpsert.calls[0][1].should.have.properties({
        ...lodash.omit(report, 'result'),
        dependencies: JSON.stringify(report.result.dependencies),
        devDependencies: JSON.stringify(report.result.devDependencies),
      });
    });
  });

  function test(response) {
    response.should.have.properties(
      ['isResponse', 'statusCode', 'message', 'stack']);

    response.isResponse.should.equal(true);
    response.statusCode.should.equal(400);
    response.stack.should.not.be.empty();

    return response;
  }

  it('should reject to upsert report if branch not specified', () =>
    model('report').upsert({
      ...report,
      branch: null,
    })
    .catch(response => test(response).message.should.containEql('branch')
      .and.containEql('missing')));

  it('should reject to upsert report if branch is not string', () =>
    model('report').upsert({
      ...report,
      branch: 12345,
    })
    .catch(response => test(response).message.should.containEql('branch')
      .and.containEql('string')));

  it('should reject to upsert report if report not specified', () =>
    model('report').upsert({
      ...report,
      report: null,
    })
    .catch(response => test(response).message.should.containEql('report')
      .and.containEql('missing')));

  it('should reject to upsert report if report is not string', () =>
    model('report').upsert({
      ...report,
      report: 12345,
    })
    .catch(response => test(response).message.should.containEql('report')
      .and.containEql('string')));

  it('should allow to upsert report if report name is empty string', () =>
    model('report', {
      '../services': {
        table: {
          upsert: mockFunction({
            'report': true,
          }),
        },
      },
    })
    .upsert({
      ...report,
      report: '',
    })
    .then(result => result.should.have.property('report', true)));

  it('should reject to upsert report if result not specified', () =>
    model('report').upsert({
      ...report,
      result: null,
    })
    .catch(response => test(response).message.should.containEql('result')
      .and.containEql('missing')));

  it('should reject to upsert report if dependencies is not string array', () =>
    model('report').upsert({
      ...report,
      result: {
        dependencies: [123, {}],
        devDependencies: [],
      },
    })
    .catch(response => test(response).message
      .should.containEql('dependencies')
      .and.containEql('string array')));

  it('should reject to upsert report if devDependencies not specified', () =>
    model('report').upsert({
      ...report,
      result: {
        dependencies: [],
        devDependencies: null,
      },
    })
    .catch(response => test(response).message
      .should.containEql('devDependencies')
      .and.containEql('string array')));
});
