import * as queue from './queue';
import * as logger from './logger';

function process(message, fn) {
  if (!message) {
    logger.debug('No message in the queue.');
    throw new Error('no-message');
  }

  logger.debug(`Process the message, id: [${message.messageid}], text: [${message.messagetext}]`);
  return fn(message.messagetext).then(() => message);
}

function handle(error, query) {
  if (error && error.message !== 'no-message') {
    logger.error(`Error happens. ${error}`);
  }

  // when error or no-message, sleep 10 second before next query
  const interval = error ? 10000 : 0;

  logger.debug(`Finish query, trigger next query after ${interval}ms.`);
  setTimeout(query, interval);
}

export function execute(queueName, fn) {
  function query() {
    logger.debug(`Start query on the queue [${queueName}].`);
    queue.peek(queueName)
    .then(message => process(message, fn))
    .then(message => queue.remove(queueName, message))
    .then(() => handle(null, query), error => handle(error, query));
  }

  logger.debug(`Listen on jobs in the queue [${queueName}].`);
  setTimeout(query, 0);
}
