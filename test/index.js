/* global describe, it */

import request from 'supertest';
import proxyquire from 'proxyquire';
import * as services from './fake/services';

const app = proxyquire('../src/app', {
  './services': services,
});

describe('/', () =>
  it('should return home page', done =>
    request(app)
      .get('/')
      .expect(200, /hello world/i)
      .end(done)));
