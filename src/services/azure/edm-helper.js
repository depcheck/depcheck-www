import azure from 'azure-storage';
import * as logger from './logger';

// HACK an internal helper, see Azure/azure-storage-node#93
import edmHandler from 'azure-storage/lib/services/table/internal/edmhandler';

const generateEntityValue = azure.TableUtilities.entityGenerator.Entity;

function normalizeRecord(record) {
  function tryId(separator) {
    const index = record.id.indexOf(separator);
    return index === -1
    ? false
    : {
      ...record,
      PartitionKey: record.id.substring(0, index),
      RowKey: record.id.substring(index + separator.length),
    };
  }

  // parse PartitionKey and RowKey from id
  return tryId('-$KEY$-') || tryId('-') || record;
}

function toEntityValue(record, key) {
  const value = record[key];
  return key === '.metadata'
    ? value
    : generateEntityValue(value, edmHandler.propertyType(value, true));
}

function toRecordValue(value) {
  // use typeof check here to handle value._ is empty string, or zero number.
  return typeof value._ !== 'undefined' ? value._ : value;
}

export function toEntity(record) {
  const normalizedRecord = normalizeRecord(record);
  const entity = Object.keys(normalizedRecord).reduce((result, key) => ({
    ...result,
    [key]: toEntityValue(normalizedRecord, key),
  }), {});

  logger.debug(`[service:azure] convert to entity ${JSON.stringify(entity)}`);
  return entity;
}

export function toRecord(entity) {
  return Object.keys(entity).reduce((result, key) => ({
    ...result,
    [key]: toRecordValue(entity[key]),
  }), {});
}

export const serializeQueryValue = edmHandler.serializeQueryValue;
