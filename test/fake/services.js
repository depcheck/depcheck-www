import path from 'path';
import winston from 'winston';

export const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      filename: path.resolve(__dirname, '../test.log'),
      level: 'debug',
    }),
  ],
});

function insert() {
  return Promise.resolve({
    token: 'new-token',
  });
}

function query(tableName) {
  return Promise.resolve(
    tableName === 'token'
    ? [
      {
        repo: 'tester-1',
        token: 'tester-1-token',
      },
      {
        repo: 'other-1',
        token: 'other-1-token',
      },
      {
        repo: 'other-2',
        token: 'other-2-token',
      },
    ]
    : [
      {
        branch: 'master',
        report: '',
        dependencies: JSON.stringify([]),
        devDependencies: JSON.stringify([]),
      },
      {
        branch: 'master',
        report: 'fail',
        dependencies: JSON.stringify(['unused']),
        devDependencies: JSON.stringify([]),
      },
    ]);
}

function upsert(tableName, record) {
  return Promise.resolve(record);
}

export const table = {
  insert,
  query,
  upsert,
};

export default function fakeServices(stubs) {
  function session(req, res, next) {
    req.session = stubs.session;
    next();
  }

  return {
    logger,
    session,
    table: {
      insert(tableName, record) {
        stubs.table.insert.push({ tableName, record });
        return Promise.resolve(record);
      },
      query: (...args) => stubs.table.query(...args),
    },
  };
}
