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

describe('/', () =>
  it('should return home page', done =>
    request(app)
      .get('/')
      .expect(200, /Depcheck Web Service/i)
      .end(done)));

describe('/login/test', () =>
  it('should redirect to OAuth login page', done =>
    request(app)
      .get('/login/test')
      .expect(302)
      .expect('Location', providers.expectedLoginUrl)
      .end(done)));

describe('/login/test/callback', () =>
  it('should redirect to login user page', done =>
    request(app)
      .get('/login/test/callback?code=123')
      .expect(302)
      .expect('Location', `${providers.expectUserUrl}?code=123`)
      .end(done)));

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

describe('/token/provider/tester/test-2', () => {
  it('should post to create a token', done =>
    request(app)
      .post('/token/provider/tester/test-2')
      .expect(302)
      .expect('Location', `/provider/tester`)
      .end(done));

  it('should get a token', done =>
    request(app)
      .get('/token/provider/tester/test-2')
      .expect(200, /tester-1-token/)
      .end(done));
});

describe('/provider/tester/test-1/master.svg', () => {
  it('should get a passing badge for report without unused dependencies', done =>
    request(app)
      .get('/provider/tester/test-1/master.svg')
      .expect(200)
      .expect(res => res.text = res.body.toString('utf8'))
      .expect(/^<svg/)
      .expect(/passing/)
      .end(done));

  it('should get a failing badge for report with unused dependencies', done =>
    request(app)
      .get('/provider/tester/test-1/master/fail.svg')
      .expect(200)
      .expect(res => res.text = res.body.toString('utf8'))
      .expect(/^<svg/)
      .expect(/failing/)
      .end(done));
});

describe('/provider/tester/test-1', () => {
  it('should render the repo page', done =>
    request(app)
      .get('/provider/tester/test-1')
      .expect(200)
      .expect(/master/)
      .expect(/fail/)
      .expect(/unused/)
      .end(done));

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
