import proxyquire from 'proxyquire';
import logger from './logger';

export default function route(name, mocks) {
  const module = proxyquire(`../../src/routes/${name}`, {
    ...mocks,
    '../../services': {
      logger,
    },
  });

  return module;
}
