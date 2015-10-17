import path from 'path';
import Database from 'locallydb';
import * as logger from './logger';

const db = new Database(path.resolve(__dirname, './db'));

function meet(filter) {
  return filter === undefined
  ? item => item // filter nothing
  : item => Object.keys(item).every(key =>
      filter[key] === undefined || // if not define this criteria, skip it
      filter[key] === item[key]); // if defined, the item must meet it
}

export function ensure(tableName) {
  logger.debug(`[service:local] ensure table [${tableName}] exist (no-op).`);
  return Promise.resolve();
}

export function query(tableName, { limit, filter } = {}) {
  logger.debug(`[service:local] query records in table [${tableName}] with limit [${limit}] and filter [${JSON.stringify(filter)}].`);
  return new Promise(resolve => {
    const items = db.collection(tableName).items
      .filter(meet(filter))
      .splice(0, limit || 10000); // at most 10k once

    resolve(items);
  });
}

export function insert(tableName, record) {
  logger.debug(`[service:local] insert record ${JSON.stringify(record)} into table [${tableName}].`);
  return new Promise(resolve => {
    const collection = db.collection(tableName);
    collection.insert(record);
    resolve(record);
  });
}

export function update(tableName, record) {
  logger.debug(`[service:local] update record with id [${record.id}] from table [${tableName}] to ${JSON.stringify(record)}.`);
  return new Promise(resolve => {
    const collection = db.collection(tableName);
    collection.update(record.cid, record);
    resolve(record);
  });
}

export function remove(tableName, record) {
  logger.debug(`[service:local] remove record with id [${record.cid}] from table [${tableName}].`);
  return new Promise(resolve => {
    const collection = db.collection(tableName);
    collection.remove(record.cid);
    resolve(record);
  });
}
