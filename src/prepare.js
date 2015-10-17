import { logger, table } from './services';

const tables = [
];

export default function prepare() {
  logger.debug(`[prepare] ensure tables exist: ${tables}`);
  const ensureTables = tables.map(item => table.ensure(item));

  return Promise.all([ensureTables])
    .catch(error => logger.error(`[prepare] error on prepare: ${error}`));
}
