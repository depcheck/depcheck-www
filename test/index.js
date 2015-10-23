/* global describe, it */

import request from 'supertest';
import proxyquire from 'proxyquire';
import * as services from './fake/services';
import * as providers from './fake/providers';

// HACK on proxyquire global override, should avoid them in the future.
const app = proxyquire('../src/app', {
  './services': services,
  '../services': { ...services, '@global': true },
  '../providers': { ...providers, '@global': true },
});

describe('/', () =>
  it('should return home page', done =>
    request(app)
      .get('/')
      .expect(200, /hello world/i)
      .end(done)));

describe('/login/test', () =>
  it('should redirect to OAuth login page', done =>
    request(app)
      .get('/login/test')
      .expect(302)
      .expect('Location', providers.expectedLoginUrl)
      .end(done)));
