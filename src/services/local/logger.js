import winston from 'winston';

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      debugStdout: true,
      colorize: true,
    }),
  ],
});

export default logger;
