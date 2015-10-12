import * as job from './azure/job';
import * as table from './azure/table';
import * as logger from './azure/logger';

job.execute('ping', message => {
  logger.info(`Get message [${message}], pong back.`);

  return table.insert('ping', {
    PartitionKey: 'pong',
    RowKey: message,
    type: 'pong',
    time: message,
  });
});
