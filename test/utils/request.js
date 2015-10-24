import supertest from 'supertest';
import proxyquire from 'proxyquire';
import route from './route';
import * as services from '../fake/services';

export default function request(name, mocks) {
  const routes = proxyquire('../../src/routes', {
    [`./${name}`]: route(name, mocks),
    '../services': services,
  });

  const app = proxyquire('../../src/app', {
    './routes': routes,
    './services': services,
  });

  return supertest(app);
}
