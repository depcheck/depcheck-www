import supertest from 'supertest';
import proxyquire from 'proxyquire';
import * as services from '../fake/services';

export default function request(name, mocks) {
  const route = proxyquire(`../../src/routes/${name}`, {
    ...mocks,
    '../../services': services,
  });

  const routes = proxyquire('../../src/routes', {
    [`./${name}`]: route,
    '../services': services,
  });

  const app = proxyquire('../../src/app', {
    './routes': routes,
    './services': services,
  });

  return supertest(app);
}
