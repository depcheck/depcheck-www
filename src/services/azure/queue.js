import azure from 'azure-storage';
import * as logger from './logger';

const queueService = azure.createQueueService();

function call(functionName, ...args) {
  return new Promise((resolve, reject) =>
    queueService[functionName](...args, (error, result) =>
      error ? reject(error) : resolve(result)));
}

export function ensure(queueName) {
  logger.debug(`[service:azure] ensure queue [${queueName}] exist.`);
  return call('createQueueIfNotExists', queueName);
}

export function process(message, fn) {
  logger.debug(`[service:azure] process message with id [${message.messageid}].`);
  return fn(message.messagetext);
}

export function peek(queueName) {
  logger.debug(`[service:azure] peek message from queue [${queueName}].`);
  return call('getMessages', queueName, { numOfMessages: 1 })
    .then(([message]) => message);
}

export function insert(queueName, message) {
  logger.debug(`[service:azure] insert message [${message}] into queue [${queueName}].`);
  return call('createMessage', queueName, message);
}

export function remove(queueName, message) {
  logger.debug(`[service:azure] remove message [${message.messagetext}] from queue [${queueName}].`);
  return call('deleteMessage', queueName, message.messageid, message.popreceipt);
}
