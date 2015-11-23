import supertest from 'supertest';
import proxyquire from 'proxyquire';
import logger from './logger';

function stubServices(stubs) {
  return {
    logger,
    session: (req, res, next) => {
      req.session = stubs.session;
      next();
    },
    table: {
      insert: (...args) => stubs.table.insert(...args),
      query: (...args) => stubs.table.query(...args),
      upsert: (...args) => stubs.table.upsert(...args),
    },
    '@global': true,
    '@noCallThru': true,
  };
}

function stubProviders(stubs) {
  return {
    getProvider: () => ({
      getAccessToken: (...args) => stubs.providers.getAccessToken(...args),
      getLoginUrl: (...args) => stubs.providers.getLoginUrl(...args),
      getUser: (...args) => stubs.providers.getUser(...args),
      query: (...args) => stubs.providers.query(...args),
    }),
    '@global': true,
    '@noCallThru': true,
  };
}

export default function stub(stubs) {
  const services = stubServices(stubs);
  const providers = stubProviders(stubs);

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
