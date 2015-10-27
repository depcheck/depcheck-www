/* global describe, it */

import request from 'supertest';
import proxyquire from 'proxyquire';
import * as services from './fake/services';
import * as providers from './fake/providers';

function validate(req, res, next) {
  return next ? next() : Promise.resolve();
}

// HACK on proxyquire global override, should avoid them in the future.
const app = proxyquire('../src/app', {
  './services': services,
  '../services': { ...services, '@global': true },
  '../providers': { ...providers, '@global': true },
  '../models/login': { validate, '@global': true },
  '../models/token': { validate, '@global': true },
});

describe('/provider/tester', () =>
  it('should render repo list for the tester', done =>
    request(app)
      .get('/provider/tester')
      .expect(200)
      .expect(/provider\/tester/)
      .expect(/tester-1/)
      .expect(/tester-2/)
      .expect(/other-1/)
      .expect(/other-2/)
      .end(done)));

describe('/provider/tester/test-1', () => {
  it('should post to create a new report', done =>
    request(app)
      .post('/provider/tester/test-1')
      .send({
        token: 'fake-token',
        branch: 'test',
        report: 'new',
        result: {
          dependencies: ['dep'],
          devDependencies: ['devDep'],
        },
      })
      .expect(200)
      .expect({
        branch: 'test',
        id: 'provider:tester:test-1-$KEY$-test:new',
        provider: 'provider',
        repo: 'test-1',
        report: 'new',
        user: 'tester',
        dependencies: JSON.stringify(['dep']),
        devDependencies: JSON.stringify(['devDep']),
      })
      .end(done));
});
