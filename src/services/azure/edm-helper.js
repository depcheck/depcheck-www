import azure from 'azure-storage';

// HACK an internal helper, see Azure/azure-storage-node#93
import edmHandler from 'azure-storage/lib/services/table/internal/edmhandler';

const generateEntityValue = azure.TableUtilities.entityGenerator.Entity;

function toEntityValue(value) {
  const type = edmHandler.propertyType(value, true);
  return generateEntityValue(value, type);
}

function toRecordValue(value) {
  // use typeof check here to handle value._ is empty string, or zero number.
  return typeof value._ !== 'undefined' ? value._ : value;
}

export function toEntity(record) {
  // parse PartitionKey and RowKey from id
  const index = record.id.indexOf('-');
  record.PartitionKey = record.id.substring(0, index);
  record.RowKey = record.id.substring(index + 1);

  return Object.keys(record).reduce((result, key) => ({
    ...result,
    [key]: key === '.metadata' ? record[key] : toEntityValue(record[key]),
  }), {});
}

export function toRecord(entity) {
  return Object.keys(entity).reduce((result, key) => ({
    ...result,
    [key]: toRecordValue(entity[key]),
  }), {});
}

export const serializeQueryValue = edmHandler.serializeQueryValue;
