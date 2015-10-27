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
