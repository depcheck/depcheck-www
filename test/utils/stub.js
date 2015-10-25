import supertest from 'supertest';
import proxyquire from 'proxyquire';
import fakeServices from '../fake/services';

export default function request(stubs) {
  const services = {
    ...fakeServices(stubs),
    '@global': true,
  };

  const app = proxyquire('../../src/app', {
    './services': services,
    '../services': services,
    '../../services': services,
  });

  return supertest(app);
}
