import proxyquire from 'proxyquire';
import logger from './logger';

export default function model(name) {
  return proxyquire(`../../src/models/${name}`, {
    '../services': {
      logger,
    },
  });
}
