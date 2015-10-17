import * as logger from './logger';
import * as table from './table';

export function ensure(queueName) {
  logger.debug(`[service:local] ensure queue [${queueName}] exist (no-op).`);
  return Promise.resolve();
}

export function process(message, fn) {
  logger.debug(`[service:local] process message with id [${message.cid}].`);
  return fn(message.message);
}

export function peek(queueName) {
  logger.debug(`[service:local] peek message from queue [${queueName}].`);
  return table.query(`queue_${queueName}`).then(docs => docs[0]);
}

export function insert(queueName, message) {
  logger.debug(`[service:local] insert message [${message}] into queue [${queueName}].`);
  return table.insert(`queue_${queueName}`, { message });
}

export function remove(queueName, message) {
  logger.debug(`[service:local] remove message [${message.message}] from queue [${queueName}].`);
  return table.remove(`queue_${queueName}`, message);
}
