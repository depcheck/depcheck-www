import azure from 'azure-storage';
import * as logger from './logger';

const queueService = azure.createQueueService();

function call(functionName, ...args) {
  return new Promise((resolve, reject) =>
    queueService[functionName](...args, (error, result) =>
      error ? reject(error) : resolve(result)));
}

export function ensure(queueName) {
  logger.debug(`Ensure queue [${queueName}] exist.`);
  return call('createQueueIfNotExists', queueName);
}

export function peek(queueName) {
  logger.debug(`Peek message from queue [${queueName}].`);
  return call('getMessages', queueName, { numOfMessages: 1 })
    .then(([message]) => message);
}

export function insert(queueName, message) {
  logger.debug(`Insert message [${message}] into queue [${queueName}].`);
  return call('createMessage', queueName, message);
}

export function remove(queueName, message) {
  logger.debug(`Remove message [${message.messagetext}] from queue [${queueName}].`);
  return call('deleteMessage', queueName, message.messageid, message.popreceipt);
}
