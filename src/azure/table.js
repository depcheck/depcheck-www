import azure from 'azure-storage';
import * as logger from './logger';

const generator = azure.TableUtilities.entityGenerator;
const tableService = azure.createTableService();

function isInt(value) {
  return parseFloat(value) === parseInt(value, 10) && !isNaN(value);
}

function toEntityType(value) {
  switch (value.constructor) {
  case Number:
    return isInt(value)
    ? generator.Int32(value) // eslint-disable-line new-cap
    : generator.Double(value); // eslint-disable-line new-cap
  case Boolean:
    return generator.Boolean(value);
  case String:
    return generator.String(value);
  case Date:
    return generator.DateTime(value); // eslint-disable-line new-cap
  default:
    throw new Error(`The type of value, ${value.constructor}, is not supported to generate Edm type.`);
  }
}

function toEntity(record) {
  return Object.keys(record).reduce(
    (result, key) =>
      Object.assign(result, { [key]: toEntityType(record[key]) }),
    {});
}

function call(functionName, ...args) {
  return new Promise((resolve, reject) =>
    tableService[functionName](...args, (error, result) =>
      error ? reject(error) : resolve(result)));
}

export function ensure(tableName) {
  logger.debug(`Ensure table [${tableName}] exist.`);
  return call('createTableIfNotExists', tableName);
}

export function query(tableName) {
  logger.debug(`Query all entities from table [${tableName}].`);
  return call('queryEntities', tableName, null, null);
}

export function insert(tableName, record) {
  logger.debug(`Insert record ${JSON.stringify(record)} into table [${tableName}].`);
  const entity = toEntity(record);
  return call('insertEntity', tableName, entity);
}
