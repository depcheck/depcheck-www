import supertest from 'supertest';
import proxyquire from 'proxyquire';
import fakeServices from '../fake/services';
import fakeProviders from '../fake/providers';

export default function request(stubs) {
  const services = {
    ...fakeServices(stubs),
    '@global': true,
    '@noCallThru': true,
  };

  const providers = {
    getProvider() {
      return fakeProviders(stubs);
    },
    '@global': true,
    '@noCallThru': true,
  };

  const app = proxyquire('../../src/app', {
    './services': services,
    '../services': services,
    '../../services': services,
    './providers': providers,
    '../providers': providers,
    '../../providers': providers,
  });

  return supertest(app);
}
