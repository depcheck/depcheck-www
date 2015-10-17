import winston from 'winston';
import { AzureLogger } from 'winston-azuretable';

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({ level: 'debug', debugStdout: true }),
    new AzureLogger({ partitionKey: 'depcheck' }),
  ],
});

export default logger;
