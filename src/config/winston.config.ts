import * as winston from 'winston';

export const winstonConfig: winston.LoggerOptions = {
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
          ({ timestamp, level, message }) =>
            `[${timestamp}] [${level}]: ${message}`,
        ),
      ),
    }),
    // All logs for the app
    new winston.transports.File({
      filename: 'logs/app.log',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
          ({ timestamp, level, message }) =>
            `[${timestamp}] [${level}]: ${message}`,
        ),
      ),
    }),

    // All success logs for the app
    new winston.transports.File({
      filename: 'logs/success.log',
      level: 'info',
      format: winston.format.combine(
        winston.format((info) => (info.level === 'info' ? info : false))(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
          ({ timestamp, level, message }) =>
            `[${timestamp}] [${level}]: ${message}`,
        ),
      ),
    }),

    //All error logs for the app
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
          ({ timestamp, level, message }) =>
            `[${timestamp}] [${level}]: ${message}`,
        ),
      ),
    }),
  ],
};
