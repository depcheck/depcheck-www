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
