/* global describe, it */

import request from 'supertest';
import app from '../src/app';

describe('/', () =>
  it('should return home page', done =>
    request(app)
      .get('/')
      .expect(200, /hello world/i)
      .end(done)));
