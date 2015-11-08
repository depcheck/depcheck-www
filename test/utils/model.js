import lodash from 'lodash';
import proxyquire from 'proxyquire';
import logger from './logger';

export default function model(name, mocks = {}) {
  return proxyquire(`../../src/models/${name}`, lodash.merge({
    '../services': {
      logger,
    },
  }, mocks));
}
