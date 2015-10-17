import azure from 'azure-storage';
import * as logger from './logger';
import { toEntity, toRecord, serializeQueryValue } from './edm-helper';

const tableService = azure.createTableService();

function call(functionName, ...args) {
  return new Promise((resolve, reject) =>
    tableService[functionName](...args, (error, result) =>
      error ? reject(error) : resolve(result)));
}

function buildTableQuery({ limit, filter }) {
  const tableQuery = new azure.TableQuery();

  if (typeof limit === 'number') {
    tableQuery.top(limit);
  }

  if (typeof filter === 'object') {
    const condition = Object.keys(filter)
      .map(key => `${key} eq ${serializeQueryValue(filter[key])}`)
      .join(' and ');

    logger.debug(`[service:azure] build query where with [${condition}].`);
    tableQuery.where(condition);
  }

  return tableQuery;
}

export function ensure(tableName) {
  logger.debug(`[service:azure] ensure table [${tableName}] exist.`);
  return call('createTableIfNotExists', tableName);
}

export function query(tableName, options = {}) {
  logger.debug(`[service:azure] query entities from table [${tableName}] with options [${JSON.stringify(options)}].`);
  return call('queryEntities', tableName, buildTableQuery(options), null)
    .then(result => result.entries.map(toRecord));
}

export function insert(tableName, record) {
  logger.debug(`[service:azure] insert record ${JSON.stringify(record)} into table [${tableName}].`);
  return call('insertEntity', tableName, toEntity(record))
    .then(result => ({ ...record, ...result }));
}

export function update(tableName, record) {
  logger.debug(`[service:azure] update record with id [${record.id}] from table [${tableName}] to ${JSON.stringify(record)}.`);
  return call('updateEntity', tableName, toEntity(record))
    .then(result => ({ ...record, ...result}));
}

export function upsert(tableName, record) {
  logger.debug(`[service:azure] upsert record ${JSON.stringify(record)} into table [${tableName}].`);
  const entity = toEntity(record);
  return call('insertEntity', tableName, entity)
    .catch(() => call('updateEntity', tableName, entity))
    .then(result => ({ ...record, ...result }));
}
