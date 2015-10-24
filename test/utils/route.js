import proxyquire from 'proxyquire';
import * as services from '../fake/services';

export default function route(name, mocks) {
  const module = proxyquire(`../../src/routes/${name}`, {
    ...mocks,
    '../../services': services,
  });

  return module;
}
