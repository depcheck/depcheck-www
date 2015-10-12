import winston from 'winston';

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({ level: 'debug' }),
  ],
});

export default logger;
