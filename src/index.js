import express from 'express';
import * as table from './azure/table';
import * as queue from './azure/queue';
import * as logger from './azure/logger';

const port = process.env.PORT || 3000;
const app = express();

app.get('/', (req, res) => {
  const tableName = 'ping';
  table.ensure(tableName)
  .then(() => table.query(tableName))
  .then(data => res.send(data), error => res.send(error));
});

app.post('/ping', (req, res) => {
  const tableName = 'ping';
  const dateTime = new Date();
  const record = {
    PartitionKey: 'ping',
    RowKey: dateTime.toString(),
    type: 'ping',
    time: dateTime,
  };

  table.ensure(tableName)
  .then(() => table.insert(tableName, record))
  .then(() => queue.ensure(tableName))
  .then(() => queue.insert(tableName, dateTime.toString()))
  .then(data => res.send(data), error => res.status(500).send(error.toString()));
});

app.listen(port, () => {
  logger.info(`Server started, listening on ${port}.`);
});
